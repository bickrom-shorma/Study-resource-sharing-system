import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getNoteDownloadUrl } from '../services/api';
import { Eye, Download, User, Calendar, FileText } from 'lucide-react';

const NoteCard = ({ note }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/notes/${note.id}`);
  };

  const handleDownload = () => {
    window.open(getNoteDownloadUrl(note.id), '_blank');
  };

  const formattedDate = note.created_at
    ? new Date(note.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div className="note-card">
      <div className="note-header">
        <div className="note-badges">
          <span className="badge badge-subject">{note.subject_name || 'General Subject'}</span>
          <span className="badge badge-topic">{note.topic_name || 'General Topic'}</span>
        </div>
        <h3 className="note-title" title={note.title}>
          <FileText size={18} color="#6366f1" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          {note.title}
        </h3>
        <div className="note-uploader">
          <User size={14} />
          <span>Uploaded by: <strong>{note.uploaded_by_name || 'Department Student'}</strong></span>
        </div>
        {formattedDate && (
          <div className="note-uploader" style={{ marginTop: '4px', fontSize: '0.8rem', opacity: 0.8 }}>
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>

      <div className="note-actions">
        <button onClick={handleView} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          <Eye size={15} /> View PDF
        </button>
        <button onClick={handleDownload} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
          <Download size={15} /> Download
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
