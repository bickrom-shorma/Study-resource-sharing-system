const db = require('../config/db');

// Get all subjects
exports.getSubjects = async (req, res) => {
  try {
    const [subjects] = await db.query('SELECT * FROM subjects ORDER BY subject_name ASC');
    return res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching subjects.', error: error.message });
  }
};

// Get topics by subject ID
exports.getTopicsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const [topics] = await db.query('SELECT * FROM topics WHERE subject_id = ? ORDER BY topic_name ASC', [subjectId]);
    return res.status(200).json({ success: true, topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching topics.', error: error.message });
  }
};
