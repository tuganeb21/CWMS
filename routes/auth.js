const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Fill all fields' });

  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });
  res.json({ message: 'Registered' });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  req.session.user = user._id;          // store MongoDB _id
  res.json({ message: 'Login successful' });
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// SESSION CHECK (used by App.js)
router.get('/check', (req, res) => {
  res.json({ authenticated: !!req.session.user });
});

module.exports = router;