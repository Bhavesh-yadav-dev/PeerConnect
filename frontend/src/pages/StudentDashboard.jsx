import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TutorCard from '../components/TutorCard';

function StudentDashboard() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const studentId = user ? user.id : '';
        const response = await api.get(`/students/tutors?student_id=${studentId}`);
        setTutors(response.data);
      } catch (err) {
        setError('Failed to load tutors.');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [user]);

  return (
    <div className="container">
      <h2 style={{ marginBottom: '0.5rem' }}>Find a Tutor</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Connect with senior students ready to help you with technical subjects.
      </p>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <p>Loading tutors...</p>
      ) : tutors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            No registered tutors available at the moment. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
