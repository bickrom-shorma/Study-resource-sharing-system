import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchNotes, fetchSubjects, fetchTopicsBySubject, searchNotes } from '../services/api';
import NoteCard from '../components/NoteCard';
import { Search, BookOpen, Layers, Users, FileText, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [notesRes, subjectsRes] = await Promise.all([
        fetchNotes(),
        fetchSubjects()
      ]);

      if (notesRes.data && notesRes.data.success) {
        setNotes(notesRes.data.notes);
      }
      if (subjectsRes.data && subjectsRes.data.success) {
        setSubjects(subjectsRes.data.subjects);
      }
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedTopic('all');
    setTopics([]);

    if (subjectId !== 'all') {
      try {
        const res = await fetchTopicsBySubject(subjectId);
        if (res.data && res.data.success) {
          setTopics(res.data.topics);
        }
      } catch (err) {
        console.error('Error loading topics:', err);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('query', searchQuery);
    if (selectedSubject !== 'all') queryParams.append('subject_id', selectedSubject);
    if (selectedTopic !== 'all') queryParams.append('topic_id', selectedTopic);

    navigate(`/notes?${queryParams.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-tag">
          <Sparkles size={14} /> Department Academic Portal
        </div>
        <h1 className="hero-title">
          Share & Access Department <br />
          Study Notes Seamlessly
        </h1>
        <p className="hero-subtitle">
          A centralized resource repository built exclusively for department students. Search, view, upload, and download PDF notes for every course.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/notes" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
            Browse All Notes <ArrowRight size={18} />
          </Link>
          <Link to="/upload" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
            Upload PDF Notes
          </Link>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="search-card">
        <form onSubmit={handleSearchSubmit} className="search-grid">
          <div className="form-group">
            <label className="form-label">Search Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by note title, subject, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <select className="form-select" value={selectedSubject} onChange={handleSubjectChange}>
              <option value="all">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Topic</label>
            <select
              className="form-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={selectedSubject === 'all'}
            >
              <option value="all">All Topics</option>
              {topics.map((top) => (
                <option key={top.id} value={top.id}>
                  {top.topic_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ height: '46px' }}>
              <Search size={18} /> Search
            </button>
          </div>
        </form>
      </section>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <BookOpen size={28} color="#6366f1" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.8rem', color: '#fff' }}>{notes.length}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Study Notes</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <Layers size={28} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.8rem', color: '#fff' }}>{subjects.length}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Department Subjects</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <FileText size={28} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.8rem', color: '#fff' }}>100% PDF</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PDF Verified Format</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <Users size={28} color="#a855f7" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.8rem', color: '#fff' }}>Open Access</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Free Browsing for All</p>
        </div>
      </div>

      {/* Latest Uploaded Notes */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>Latest Uploaded Notes</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recently added study materials by your department peers.</p>
          </div>
          <Link to="/notes" className="btn btn-secondary btn-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>Loading latest study notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No study notes uploaded yet</h3>
            <p style={{ margin: '0.5rem 0 1.5rem' }}>Be the first student to upload notes for your department!</p>
            <Link to="/upload" className="btn btn-primary">
              Upload PDF Note
            </Link>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.slice(0, 6).map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
