import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TutorProfileEdit() {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const [formData, setFormData] = useState({
    user_id: user ? user.id : '',
    name: '',
    semester: '5th',
    branch: 'CSE',
    subjects: '',
    preferred_time: '',
    contact_email: '',
    instagram: '',
    bio: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        const response = await api.get(`/tutors/profile?user_id=${user.id}`);
        setFormData({
          user_id: user.id,
          name: response.data.name || '',
          semester: response.data.semester || '5th',
          branch: response.data.branch || 'CSE',
          subjects: response.data.subjects || '',
          preferred_time: response.data.preferred_time || '',
          contact_email: response.data.contact_email || response.data.email || '',
          instagram: response.data.instagram || '',
          bio: response.data.bio || ''
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const response = await api.put('/tutors/profile', formData);
      setMessage('Profile updated successfully!');

      // Update localStorage user name if changed
      const updatedUser = {
        ...user,
        name: formData.name,
        semester: formData.semester,
        branch: formData.branch
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>Loading profile...</p></div>;

  return (
    <div className="container">
      <div className="form-card" style={{ maxWidth: '650px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          My Tutor Profile
        </h2>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Semester</label>
              <select name="semester" value={formData.semester} onChange={handleChange}>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="3rd">3rd Semester</option>
                <option value="4th">4th Semester</option>
                <option value="5th">5th Semester</option>
                <option value="6th">6th Semester</option>
                <option value="7th">7th Semester</option>
                <option value="8th">8th Semester</option>
              </select>
            </div>

            <div className="form-group">
              <label>Branch</label>
              <select name="branch" value={formData.branch} onChange={handleChange}>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Subjects / Topics You Teach</label>
            <input
              type="text"
              name="subjects"
              placeholder="e.g. DSA, C++, React, Node.js"
              value={formData.subjects}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Preferred Teaching Time</label>
            <input
              type="text"
              name="preferred_time"
              placeholder="e.g. 5 PM – 8 PM"
              value={formData.preferred_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gmail for Communication (Shared with accepted students)</label>
            <input
              type="email"
              name="contact_email"
              placeholder="example@gmail.com"
              value={formData.contact_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Instagram Username (Optional)</label>
            <input
              type="text"
              name="instagram"
              placeholder="e.g. @bhaveshyadav"
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Short Introduction / Bio</label>
            <textarea
              name="bio"
              rows="3"
              placeholder="Describe your tutoring style or guidance..."
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TutorProfileEdit;
