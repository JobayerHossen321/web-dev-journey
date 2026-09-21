const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

// Require Postgres database connection pool
const pool = require('./pool');

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

// Valid pre-computed bcrypt hash (salt rounds = 10) to maintain constant-time response
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

// Helper validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return typeof username === 'string' && usernameRegex.test(username.trim());
}

// -----------------------------------------------------------------------------
// POST /api/register
// -----------------------------------------------------------------------------
app.post('/api/register', async (req, res, next) => {
  const { email, password, username } = req.body;

  // 1. Strict Input Validation
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({
      error: 'Username must be 3-30 characters long and contain only letters, numbers, underscores, or hyphens.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedUsername = username.trim();

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id',
      [normalizedEmail, passwordHash, trimmedUsername]
    );

    return res.status(201).json({
      message: 'User created successfully',
      userId: result.rows[0].id
    });
  } catch (err) {
    // Postgres code '23505' == unique_violation
    if (err.code === '23505') {
      if (err.constraint === 'users_email_key') {
        return res.status(409).json({ error: 'Email is already registered.' });
      }

      if (err.constraint === 'users_username_key') {
        return res.status(409).json({ error: 'Username is already taken.' });
      }
    }
    // Delegate any unhandled errors to global handler
    next(err);
  }
});

// -----------------------------------------------------------------------------
// POST /api/login
// -----------------------------------------------------------------------------
app.post('/api/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    // 1. Lookup user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [normalizedEmail]
    );
    const user = userResult.rows[0];

    // 2. Prevent timing attack with constant-time execution
    const hashToCompare = user ? user.password_hash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(String(password), hashToCompare);

    if (!user || !isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 3. Generate session string
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();

    // 4. Save into 'token' column
    await pool.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, sessionId, expiresAt]
    );

    // 5. Set HttpOnly Cookie & Respond
    res.cookie('sessionId', sessionId, COOKIE_OPTIONS);
    return res.json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// POST /api/logout
// -----------------------------------------------------------------------------
app.post('/api/logout', async (req, res, next) => {
  const sessionId = req.cookies.sessionId;

  try {
    if (sessionId) {
      await pool.query('DELETE FROM sessions WHERE token = $1', [sessionId]);
    }

    res.clearCookie('sessionId', COOKIE_OPTIONS);
    return res.json({ message: 'Logout successful' });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// Session-check Middleware
// -----------------------------------------------------------------------------
async function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const sessionResult = await pool.query(
      'SELECT user_id, expires_at FROM sessions WHERE token = $1',
      [sessionId]
    );
    const session = sessionResult.rows[0];

    if (!session) {
      res.clearCookie('sessionId', COOKIE_OPTIONS);
      return res.status(401).json({ error: 'Invalid or expired session.' });
    }

    // Expiration check
    if (new Date(session.expires_at) < new Date()) {
      await pool.query('DELETE FROM sessions WHERE token = $1', [sessionId]);
      res.clearCookie('sessionId', COOKIE_OPTIONS);
      return res.status(401).json({ error: 'Session expired.' });
    }

    req.userId = session.user_id;
    next();
  } catch (err) {
    next(err);
  }
}

// -----------------------------------------------------------------------------
// Protected Route Example
// -----------------------------------------------------------------------------
app.get('/api/me', requireAuth, async (req, res, next) => {
  try {
    const userResult = await pool.query(
      'SELECT id, email, username, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ user });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// Global Error Handler Middleware
// -----------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});