const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_study_resource_jwt_key_2026';

// Register User
exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields (full_name, email, password) are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check existing user
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into DB
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
      [full_name.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const userId = result.insertId;

    // Generate JWT
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), full_name: full_name.trim() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: userId,
        full_name: full_name.trim(),
        email: email.toLowerCase().trim()
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

// Logout User
exports.logout = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// Get current authenticated user profile
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, full_name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user: users[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error getting profile.' });
  }
};
