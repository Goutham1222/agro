const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.render('login', { error: 'Invalid credentials' });
  const ok = await user.verifyPassword(password);
  if (!ok) return res.render('login', { error: 'Invalid credentials' });
  req.session.user = { id: user._id, username: user.username, role: user.role };
  res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.render('register', { error: 'Provide username and password' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hashed, role: 'user' });
    res.redirect('/login');
  } catch (e) {
    res.render('register', { error: 'Username taken' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(()=>{ res.redirect('/'); });
});

module.exports = router;