const db = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // store in .env in production

// Register a new user
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  // Check if email already exists
  const checkEmailSQL = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailSQL, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error during email check.' });
    if (results.length > 0) return res.status(409).json({ error: 'Email already registered.' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const insertSQL = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertSQL, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error during registration.' });

      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
};

// Login a user
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validate
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Check if user exists
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error during login.' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    // Create JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
};

// Protected route example
exports.profile = (req, res) => {
  res.json({
    message: 'Authenticated route accessed',
    user: req.user, // populated by auth middleware
  });
};
