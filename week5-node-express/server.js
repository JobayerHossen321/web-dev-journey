const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

// Require database module
const db = require('./db');

const app = express();

app.use(express.json());
app.use(cookieParser());

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: SESSION_MAX_AGE_MS
};

// Pre-computed dummy hash to maintain constant-time response on failed user lookups
// Prevents timing side-channel attack / account enumeration
const DUMMY_HASH = '$2a$10$e8V9m57uR2Xg7zC1bM9uOe8.0q2m1w3e4r5t6y7u8i9o0p1a2b3c4';

// Helper validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

// -----------------------------------------------------------------------------
// POST /api/register
// -----------------------------------------------------------------------------
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // 1. Strict Input Validation
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    const result = stmt.run(normalizedEmail, passwordHash);

    return res.status(201).json({ message: 'User created successfully', userId: result.lastInsertRowid });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// -----------------------------------------------------------------------------
// POST /api/login
// -----------------------------------------------------------------------------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // 1. Lookup user by email
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  // 2. Prevent timing attack: always run bcrypt.compare even if user isn't found
  const hashToCompare = user ? user.password_hash : DUMMY_HASH;
  const isMatch = await bcrypt.compare(String(password), hashToCompare);

  // 3. Unified rejection logic to avoid disclosing user existence
  if (!user || !isMatch) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  // 4. Create session row
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();

  db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(sessionId, user.id, expiresAt);

  // 5. Set HttpOnly Cookie & Respond
  res.cookie('sessionId', sessionId, COOKIE_OPTIONS);
  return res.json({ message: 'Login successful', userId: user.id });
});

// -----------------------------------------------------------------------------
// POST /api/logout
// -----------------------------------------------------------------------------
app.post('/api/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
  }

  res.clearCookie('sessionId', COOKIE_OPTIONS);
  return res.json({ message: 'Logout successful' });
});

// -----------------------------------------------------------------------------
// Session-check Middleware
// -----------------------------------------------------------------------------
function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const session = db.prepare(`
    SELECT user_id, expires_at 
    FROM sessions 
    WHERE id = ?
  `).get(sessionId);

  if (!session) {
    res.clearCookie('sessionId', COOKIE_OPTIONS);
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  // Expiration check
  if (new Date(session.expires_at) < new Date()) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    res.clearCookie('sessionId', COOKIE_OPTIONS);
    return res.status(401).json({ error: 'Session expired.' });
  }

  req.userId = session.user_id;
  next();
}

// -----------------------------------------------------------------------------
// Protected Route Example
// -----------------------------------------------------------------------------
app.get('/api/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(req.userId);
  return res.json({ user });
});

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
