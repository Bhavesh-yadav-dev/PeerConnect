import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await api.get(`/students/tutors/${id}`);
        setTutor(response.data);
      } catch (err) {
        setError('Failed to fetch tutor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  if (loading) return <div className="container"><p>Loading profile...</p></div>;
  if (error || !tutor) return <div className="container"><div className="error-msg">{error || 'Tutor not found'}</div></div>;

  return (
    <div className="container">
      <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
        ← Back to Dashboard
      </button>

      <div className="card" style={{ maxWidth: '650px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
          {tutor.name}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: '500' }}>
          {tutor.semester} Semester • {tutor.branch}
        </p>

        <div style={{ marginBottom: '1.25rem' }}>
          <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Subjects Can Teach:
          </strong>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-color)' }}>
            {tutor.subjects}
          </p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Preferred Teaching Time:
          </strong>
          <p style={{ fontSize: '1rem' }}>
            {tutor.preferred_time}
          </p>
        </div>

        {tutor.bio && (
          <div style={{ marginBottom: '1.5rem' }}>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              About Tutor:
            </strong>
            <p style={{ fontSize: '1rem', color: '#475569', whiteSpace: 'pre-line' }}>
              {tutor.bio}
            </p>
          </div>
        )}

        <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          🔒 <strong>Privacy Note:</strong> Gmail and Instagram contact details will become visible in your "My Requests" tab once the tutor accepts your request.
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem' }}
          onClick={() => navigate(`/request-help/${tutor.id}`, { state: { tutorName: tutor.name } })}
        >
          Request Help
        </button>
      </div>
    </div>
  );
}

export default TutorProfile;
