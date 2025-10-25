const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
  res.render('reviews', { title: 'Reviews', reviews });
});

router.post('/add', async (req, res) => {
  const { name, rating, comment } = req.body;
  await Review.create({ name: name||'Anonymous', rating: Number(rating)||0, comment });
  res.redirect('/reviews');
});

router.get('/admin', ensureAdmin, async (req, res) => {
  const reviews = await Review.find().sort({ createdAt:-1 });
  res.render('reviews-admin', { title: 'All Reviews', reviews });
});

module.exports = router;