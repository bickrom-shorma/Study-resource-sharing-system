import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNoteById, getNoteDownloadUrl } from '../services/api';
import { ArrowLeft, Download, Eye, FileText, User, Calendar, AlertCircle } from 'lucide-react';

const PdfViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNoteDetails();
  }, [id]);

  const loadNoteDetails = async () => {
    try {
      setLoading(true);
      const res = await fetchNoteById(id);
      if (res.data && res.data.success) {
        setNote(res.data.note);
      } else {
        setError('Study note not found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading note PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (note) {
      window.open(getNoteDownloadUrl(note.id), '_blank');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
        <p>Loading PDF Viewer...</p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="empty-state" style={{ margin: '3rem auto', maxWidth: '600px' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h3>Note Not Found</h3>
        <p style={{ margin: '0.5rem 0 1.5rem' }}>{error || 'The requested PDF file could not be loaded.'}</p>
        <button onClick={() => navigate('/notes')} className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Browse Notes
        </button>
      </div>
    );
  }

  // Construct PDF stream URL
  const pdfUrl = `/uploads/${note.file_name}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back
        </button>

        <button onClick={handleDownload} className="btn btn-primary btn-sm">
          <Download size={16} /> Download PDF Note
        </button>
      </div>

      {/* PDF Header Info Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="note-badges" style={{ marginBottom: '0.75rem' }}>
          <span className="badge badge-subject">{note.subject_name}</span>
          <span className="badge badge-topic">{note.topic_name}</span>
        </div>

        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText color="#6366f1" /> {note.title}
        </h1>

        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={14} /> Uploaded by: <strong style={{ color: '#fff' }}>{note.uploaded_by_name}</strong>
          </span>
          {note.created_at && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> Uploaded on: {new Date(note.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Embedded PDF Viewer Container */}
      <div className="pdf-viewer-container">
        <div className="pdf-viewer-header">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={16} color="#10b981" /> Live PDF Preview
          </span>
          <a href={pdfUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
            Open PDF in new tab
          </a>
        </div>

        <object
          data={pdfUrl}
          type="application/pdf"
          className="pdf-frame"
        >
          <div style={{ padding: '3rem', textAlign: 'center', color: '#0f172a' }}>
            <p style={{ marginBottom: '1rem', fontWeight: '600' }}>
              Your browser does not support embedded PDF viewing directly in page.
            </p>
            <button onClick={handleDownload} className="btn btn-primary">
              <Download size={16} /> Click here to Download PDF ({note.title}.pdf)
            </button>
          </div>
        </object>
      </div>
    </div>
  );
};

export default PdfViewerPage;
