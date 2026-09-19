import pool from '../config/db.js';

export const getAllTutors = async (currentUserId) => {
  let query = `
    SELECT 
      u.id, 
      u.name, 
      u.semester, 
      u.branch, 
      tp.subjects, 
      tp.preferred_time, 
      tp.bio
    FROM users u
    JOIN tutor_profiles tp ON u.id = tp.user_id
    WHERE u.account_type = 'TUTOR'
  `;

  const queryParams = [];

  if (currentUserId) {
    query += ` AND u.id != ?`;
    queryParams.push(currentUserId);
  }

  query += ` ORDER BY u.id DESC`;

  const [tutors] = await pool.query(query, queryParams);
  return tutors;
};

export const getTutorById = async (tutorId) => {
  const query = `
    SELECT 
      u.id, 
      u.name, 
      u.semester, 
      u.branch, 
      tp.subjects, 
      tp.preferred_time, 
      tp.bio
    FROM users u
    JOIN tutor_profiles tp ON u.id = tp.user_id
    WHERE u.account_type = 'TUTOR' AND u.id = ?
  `;

  const [tutors] = await pool.query(query, [tutorId]);
  if (tutors.length === 0) {
    const error = new Error('Tutor not found');
    error.statusCode = 404;
    throw error;
  }
  return tutors[0];
};

export const getTutorProfile = async (userId) => {
  const query = `
    SELECT 
      u.id, 
      u.name, 
      u.email,
      u.semester, 
      u.branch, 
      tp.subjects, 
      tp.preferred_time, 
      tp.bio,
      tp.contact_email,
      tp.instagram
    FROM users u
    JOIN tutor_profiles tp ON u.id = tp.user_id
    WHERE u.account_type = 'TUTOR' AND u.id = ?
  `;

  const [tutors] = await pool.query(query, [userId]);
  if (tutors.length === 0) {
    const error = new Error('Tutor profile not found');
    error.statusCode = 404;
    throw error;
  }
  return tutors[0];
};

export const updateTutorProfile = async (profileData) => {
  const {
    user_id,
    name,
    semester,
    branch,
    subjects,
    preferred_time,
    bio,
    contact_email,
    instagram
  } = profileData;

  if (!user_id) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update users table
    await connection.query(
      `UPDATE users SET name = ?, semester = ?, branch = ? WHERE id = ? AND account_type = 'TUTOR'`,
      [name, semester, branch, user_id]
    );

    // Update tutor_profiles table
    await connection.query(
      `UPDATE tutor_profiles 
       SET subjects = ?, preferred_time = ?, bio = ?, contact_email = ?, instagram = ? 
       WHERE user_id = ?`,
      [subjects, preferred_time, bio || '', contact_email, instagram || '', user_id]
    );

    await connection.commit();

    return getTutorProfile(user_id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
