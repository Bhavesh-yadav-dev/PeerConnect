import pool from '../config/db.js';

export const createHelpRequest = async ({ student_id, tutor_id, message }) => {
  if (!student_id || !tutor_id || !message) {
    const error = new Error('student_id, tutor_id, and message are required');
    error.statusCode = 400;
    throw error;
  }

  // Verify student exists
  const [students] = await pool.query('SELECT id FROM users WHERE id = ? AND account_type = "STUDENT"', [student_id]);
  if (students.length === 0) {
    const error = new Error('Invalid student user');
    error.statusCode = 400;
    throw error;
  }

  // Verify tutor exists
  const [tutors] = await pool.query('SELECT id FROM users WHERE id = ? AND account_type = "TUTOR"', [tutor_id]);
  if (tutors.length === 0) {
    const error = new Error('Invalid tutor user');
    error.statusCode = 400;
    throw error;
  }

  // Insert help request
  const [result] = await pool.query(
    `INSERT INTO help_requests (student_id, tutor_id, message, status) VALUES (?, ?, ?, 'PENDING')`,
    [student_id, tutor_id, message]
  );

  return {
    id: result.insertId,
    student_id,
    tutor_id,
    message,
    status: 'PENDING'
  };
};

export const getStudentRequests = async (studentId) => {
  const query = `
    SELECT 
      hr.id,
      hr.tutor_id,
      u.name AS tutor_name,
      u.semester AS tutor_semester,
      u.branch AS tutor_branch,
      tp.subjects AS tutor_subjects,
      hr.message,
      hr.status,
      hr.created_at,
      CASE WHEN hr.status = 'ACCEPTED' THEN tp.contact_email ELSE NULL END AS contact_email,
      CASE WHEN hr.status = 'ACCEPTED' THEN tp.instagram ELSE NULL END AS instagram
    FROM help_requests hr
    JOIN users u ON hr.tutor_id = u.id
    JOIN tutor_profiles tp ON hr.tutor_id = tp.user_id
    WHERE hr.student_id = ?
    ORDER BY hr.created_at DESC
  `;

  const [requests] = await pool.query(query, [studentId]);
  return requests;
};

export const getTutorRequests = async (tutorId) => {
  const query = `
    SELECT 
      hr.id,
      hr.student_id,
      u.name AS student_name,
      u.semester AS student_semester,
      u.branch AS student_branch,
      u.email AS student_email,
      hr.message,
      hr.status,
      hr.created_at
    FROM help_requests hr
    JOIN users u ON hr.student_id = u.id
    WHERE hr.tutor_id = ?
    ORDER BY hr.created_at DESC
  `;

  const [requests] = await pool.query(query, [tutorId]);
  return requests;
};

export const updateRequestStatus = async (requestId, tutorId, newStatus) => {
  // Check if request exists and belongs to tutor
  const [requests] = await pool.query(
    'SELECT * FROM help_requests WHERE id = ? AND tutor_id = ?',
    [requestId, tutorId]
  );

  if (requests.length === 0) {
    const error = new Error('Request not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  await pool.query(
    'UPDATE help_requests SET status = ? WHERE id = ?',
    [newStatus, requestId]
  );

  return {
    id: requestId,
    status: newStatus
  };
};
