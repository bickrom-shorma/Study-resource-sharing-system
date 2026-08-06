const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Upload a new study note (PDF)
exports.uploadNote = async (req, res) => {
  try {
    const { title, subject_id, topic_id } = req.body;
    const userId = req.user.id;

    if (!title || !subject_id || !topic_id) {
      return res.status(400).json({ success: false, message: 'Title, Subject, and Topic are required fields.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }

    const fileName = req.file.filename;
    const filePath = req.file.path;

    const [result] = await db.query(
      'INSERT INTO notes (title, subject_id, topic_id, uploaded_by, file_name, file_path) VALUES (?, ?, ?, ?, ?, ?)',
      [title.trim(), subject_id, topic_id, userId, fileName, filePath]
    );

    return res.status(201).json({
      success: true,
      message: 'Study note uploaded successfully!',
      noteId: result.insertId
    });
  } catch (error) {
    console.error('Error uploading note:', error);
    return res.status(500).json({ success: false, message: 'Server error uploading note.', error: error.message });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const query = `
      SELECT 
        n.id, n.title, n.subject_id, n.topic_id, n.uploaded_by, n.file_name, n.file_path, n.created_at,
        s.subject_name,
        t.topic_name,
        u.full_name AS uploaded_by_name
      FROM notes n
      JOIN subjects s ON n.subject_id = s.id
      JOIN topics t ON n.topic_id = t.id
      JOIN users u ON n.uploaded_by = u.id
      ORDER BY n.created_at DESC
    `;
    const [notes] = await db.query(query);
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching notes.', error: error.message });
  }
};

// Search notes by subject, topic, or title keyword
exports.searchNotes = async (req, res) => {
  try {
    const { query, subject_id, topic_id } = req.query;

    let sql = `
      SELECT 
        n.id, n.title, n.subject_id, n.topic_id, n.uploaded_by, n.file_name, n.file_path, n.created_at,
        s.subject_name,
        t.topic_name,
        u.full_name AS uploaded_by_name
      FROM notes n
      JOIN subjects s ON n.subject_id = s.id
      JOIN topics t ON n.topic_id = t.id
      JOIN users u ON n.uploaded_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (query && query.trim() !== '') {
      sql += ` AND (n.title LIKE ? OR s.subject_name LIKE ? OR t.topic_name LIKE ?)`;
      const searchPattern = `%${query.trim()}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (subject_id && subject_id !== 'all') {
      sql += ` AND n.subject_id = ?`;
      params.push(subject_id);
    }

    if (topic_id && topic_id !== 'all') {
      sql += ` AND n.topic_id = ?`;
      params.push(topic_id);
    }

    sql += ` ORDER BY n.created_at DESC`;

    const [notes] = await db.query(sql, params);
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error('Error searching notes:', error);
    return res.status(500).json({ success: false, message: 'Server error searching notes.', error: error.message });
  }
};

// Get single note details by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        n.id, n.title, n.subject_id, n.topic_id, n.uploaded_by, n.file_name, n.file_path, n.created_at,
        s.subject_name,
        t.topic_name,
        u.full_name AS uploaded_by_name
      FROM notes n
      JOIN subjects s ON n.subject_id = s.id
      JOIN topics t ON n.topic_id = t.id
      JOIN users u ON n.uploaded_by = u.id
      WHERE n.id = ?
    `;
    const [notes] = await db.query(query, [id]);

    if (notes.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    return res.status(200).json({ success: true, note: notes[0] });
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching note details.', error: error.message });
  }
};

// Get notes uploaded by currently logged in user
exports.getMyNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT 
        n.id, n.title, n.subject_id, n.topic_id, n.uploaded_by, n.file_name, n.file_path, n.created_at,
        s.subject_name,
        t.topic_name,
        u.full_name AS uploaded_by_name
      FROM notes n
      JOIN subjects s ON n.subject_id = s.id
      JOIN topics t ON n.topic_id = t.id
      JOIN users u ON n.uploaded_by = u.id
      WHERE n.uploaded_by = ?
      ORDER BY n.created_at DESC
    `;
    const [notes] = await db.query(query, [userId]);
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching user notes:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching my notes.', error: error.message });
  }
};

// Download note PDF file
exports.downloadNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [notes] = await db.query('SELECT title, file_name, file_path FROM notes WHERE id = ?', [id]);

    if (notes.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    const note = notes[0];
    const absolutePath = path.isAbsolute(note.file_path) 
      ? note.file_path 
      : path.join(__dirname, '..', 'uploads', note.file_name);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server.' });
    }

    const downloadFileName = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFileName}"`);

    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading note:', error);
    return res.status(500).json({ success: false, message: 'Server error downloading file.', error: error.message });
  }
};
