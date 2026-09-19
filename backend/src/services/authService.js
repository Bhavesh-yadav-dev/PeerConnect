import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const registerUser = async (userData) => {
  const {
    name,
    email,
    password,
    semester,
    branch,
    account_type,
    // Student specific
    interests,
    // Tutor specific
    subjects,
    preferred_time,
    bio,
    contact_email,
    instagram
  } = userData;

  // 1. Check if email already exists
  const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUsers.length > 0) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  // 2. Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Use connection for transaction to ensure both user and profile are saved atomically
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 3. Insert into users table
    const [userResult] = await connection.query(
      `INSERT INTO users (name, email, password, semester, branch, account_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, semester, branch, account_type]
    );

    const userId = userResult.insertId;

    // 4. Insert into profile table based on account_type
    if (account_type === 'STUDENT') {
      await connection.query(
        `INSERT INTO student_profiles (user_id, interests) VALUES (?, ?)`,
        [userId, interests || '']
      );
    } else if (account_type === 'TUTOR') {
      await connection.query(
        `INSERT INTO tutor_profiles (user_id, subjects, preferred_time, bio, contact_email, instagram) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          subjects || '',
          preferred_time || '',
          bio || '',
          contact_email || email,
          instagram || ''
        ]
      );
    }

    await connection.commit();

    return {
      id: userId,
      name,
      email,
      semester,
      branch,
      account_type
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const loginUser = async (email, password) => {
  // 1. Fetch user by email
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

  if (users.length === 0) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const user = users[0];

  // 2. Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Return user details without password
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    semester: user.semester,
    branch: user.branch,
    account_type: user.account_type
  };
};
