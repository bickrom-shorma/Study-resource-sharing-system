import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchMyNotes, getNoteDownloadUrl } from '../services/api';
import { Eye, Download, Folder, Upload, Calendar, FileText } from 'lucide-react';

const MyNotes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyNotes();
  }, []);

  const loadMyNotes = async () => {
    try {
      setLoading(true);
      const res = await fetchMyNotes();
      if (res.data && res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error('Error loading user notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/notes/${id}`);
  };

  const handleDownload = (id) => {
    window.open(getNoteDownloadUrl(id), '_blank');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Folder color="#6366f1" /> My Uploaded Notes
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage and view all study materials you have shared with the department.
          </p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          <Upload size={16} /> Upload New Note
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p>Loading your uploaded notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>You haven't uploaded any notes yet</h3>
          <p style={{ margin: '0.5rem 0 1.5rem' }}>Share your lecture notes, summaries, or past exams to help fellow students.</p>
          <Link to="/upload" className="btn btn-primary">
            Upload PDF Note Now
          </Link>
        </div>
      ) : (
        <div className="notes-table-container">
          <table className="notes-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Topic</th>
                <th>Uploaded Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  <td style={{ fontWeight: '600' }}>
                    <FileText size={16} color="#6366f1" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    {note.title}
                  </td>
                  <td>
                    <span className="badge badge-subject">{note.subject_name}</span>
                  </td>
                  <td>
                    <span className="badge badge-topic">{note.topic_name}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button onClick={() => handleView(note.id)} className="btn btn-primary btn-sm">
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => handleDownload(note.id)} className="btn btn-secondary btn-sm">
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyNotes;
