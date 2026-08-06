import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSubjects, fetchTopicsBySubject, uploadNote } from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const UploadNote = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await fetchSubjects();
      if (res.data && res.data.success) {
        setSubjects(res.data.subjects);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedTopic('');
    setTopics([]);

    if (subjectId) {
      try {
        const res = await fetchTopicsBySubject(subjectId);
        if (res.data && res.data.success) {
          setTopics(res.data.topics);
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
        setError('Only PDF files are allowed.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Please enter a note title.');
      return;
    }
    if (!selectedSubject) {
      setError('Please select a subject.');
      return;
    }
    if (!selectedTopic) {
      setError('Please select a topic.');
      return;
    }
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('subject_id', selectedSubject);
      formData.append('topic_id', selectedTopic);
      formData.append('file', file);

      const res = await uploadNote(formData);

      if (res.data && res.data.success) {
        setSuccess('Study note uploaded successfully! Redirecting...');
        setTimeout(() => {
          navigate('/notes');
        }, 1500);
      } else {
        setError(res.data.message || 'Upload failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="auth-wrapper" style={{ maxWidth: '100%', margin: 0 }}>
        <div className="auth-header">
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }}>
            <Upload size={26} />
          </div>
          <h2 className="auth-title">Upload Study Note</h2>
          <p className="auth-subtitle">Share PDF notes and lecture materials with your department</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Note Title */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Note Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Chapter 4 - Graph Algorithms Summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Subject Dropdown */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Subject *</label>
            <select className="form-select" value={selectedSubject} onChange={handleSubjectChange} required>
              <option value="">-- Select Subject --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Dropdown */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Topic *</label>
            <select
              className="form-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedSubject}
              required
            >
              <option value="">-- Select Topic --</option>
              {topics.map((top) => (
                <option key={top.id} value={top.id}>
                  {top.topic_name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload PDF File */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">PDF File Upload * (PDF only)</label>
            <div
              style={{
                border: '2px dashed var(--border-color-active)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.5)',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('pdf-file-input').click()}
            >
              <FileText size={36} color="#6366f1" style={{ marginBottom: '0.75rem' }} />
              {file ? (
                <div>
                  <p style={{ fontWeight: '600', color: '#6ee7b7' }}>{file.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontWeight: '600', color: '#fff' }}>Click to select a PDF file</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accepted file format: .pdf (Max 20MB)</p>
                </div>
              )}
              <input
                id="pdf-file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            <Upload size={18} /> {loading ? 'Uploading Note...' : 'Submit & Publish Note'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNote;
