import React from 'react';
import { useNavigate } from 'react-router-dom';

function TutorCard({ tutor }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
          {tutor.name}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
          {tutor.semester} Semester • {tutor.branch}
        </p>

        <div style={{ marginBottom: '0.75rem' }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Can Teach:
          </strong>
          <p style={{ fontWeight: '600', color: 'var(--primary-color)', marginTop: '0.25rem' }}>
            {tutor.subjects}
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Preferred Time:
          </strong>
          <p style={{ fontSize: '0.95rem', marginTop: '0.25rem' }}>
            {tutor.preferred_time}
          </p>
        </div>
      </div>

      <button
        className="btn btn-secondary"
        style={{ width: '100%', marginTop: '0.5rem' }}
        onClick={() => navigate(`/tutors/${tutor.id}`)}
      >
        View Profile
      </button>
    </div>
  );
}

export default TutorCard;
