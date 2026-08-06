import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchNotes, fetchSubjects, fetchTopicsBySubject } from '../services/api';
import NoteCard from '../components/NoteCard';
import { Search, Filter, BookOpen } from 'lucide-react';

const BrowseNotes = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject_id') || 'all');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic_id') || 'all');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject !== 'all') {
      loadTopics(selectedSubject);
    } else {
      setTopics([]);
    }
    executeSearch();
  }, [selectedSubject, selectedTopic]);

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

  const loadTopics = async (subjectId) => {
    try {
      const res = await fetchTopicsBySubject(subjectId);
      if (res.data && res.data.success) {
        setTopics(res.data.topics);
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  };

  const executeSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (query.trim()) params.query = query.trim();
      if (selectedSubject !== 'all') params.subject_id = selectedSubject;
      if (selectedTopic !== 'all') params.topic_id = selectedTopic;

      const res = await searchNotes(params);
      if (res.data && res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error('Error searching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    const subId = e.target.value;
    setSelectedSubject(subId);
    setSelectedTopic('all');

    const params = new URLSearchParams(searchParams);
    if (subId !== 'all') {
      params.set('subject_id', subId);
    } else {
      params.delete('subject_id');
    }
    params.delete('topic_id');
    setSearchParams(params);
  };

  const handleTopicChange = (e) => {
    const topId = e.target.value;
    setSelectedTopic(topId);

    const params = new URLSearchParams(searchParams);
    if (topId !== 'all') {
      params.set('topic_id', topId);
    } else {
      params.delete('topic_id');
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set('query', query.trim());
    } else {
      params.delete('query');
    }
    setSearchParams(params);
    executeSearch();
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Browse Study Notes</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Explore shared notes, lecture slides, and study resources across all department subjects.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="search-card" style={{ marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearchSubmit} className="search-grid">
          <div className="form-group">
            <label className="form-label">
              <Search size={14} style={{ display: 'inline', marginRight: '4px' }} /> Title, Keyword, or Content
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by title, subject, or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Filter Subject</label>
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
            <label className="form-label">Filter Topic</label>
            <select
              className="form-select"
              value={selectedTopic}
              onChange={handleTopicChange}
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
              <Filter size={18} /> Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Showing <strong style={{ color: '#fff' }}>{notes.length}</strong> study resource{notes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p>Fetching matching study notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No study notes found</h3>
          <p style={{ margin: '0.5rem 0' }}>Try adjusting your search keywords or subject filters.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseNotes;
