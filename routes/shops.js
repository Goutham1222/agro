const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');

const { ensureAdmin } = require('../middleware/auth');

router.get('/add', ensureAdmin, (req, res) => res.render('shops', { title: 'Add Shop' }));

router.post('/add', ensureAdmin, async (req, res) => {
  const { name, location, distance } = req.body;
  await Shop.create({ name, location, distance });
  res.redirect('/shops/nearby');
});

router.get('/nearby', async (req, res) => {
  const shops = await Shop.find().sort({ distance: 1 });
  res.render('shops', { title: 'Nearby Shops', shops });
});

module.exports = router;
