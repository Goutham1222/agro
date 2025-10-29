const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');
const { ensureAdmin } = require('../middleware/auth');

/**
 * @route   GET /shops/add
 * @desc    Render form to add a new shop (Admin only)
 */
router.get('/add', ensureAdmin, (req, res) => {
  res.render('shop-add', { title: 'Add Shop' });
});

/**
 * @route   POST /shops/add
 * @desc    Add a new shop to the database (Admin only)
 */
router.post('/add', //ensureAdmin,
 async (req, res) => {
  try {
    const { name, location, distance } = req.body;
    await Shop.create({ name, location, distance });
    res.redirect('/shops/nearby'); // Redirect to nearby shops page
  } catch (error) {
    console.error('Error adding shop:', error);
    res.status(500).send('Server error while adding shop.');
  }
});

/**
 * @route   GET /shops/nearby
 * @desc    Display all shops sorted by distance (nearest first)
 */
router.get('/nearby', async (req, res) => {
  try {
    const shops = await Shop.find().sort({ distance: 1 });
    // Debug user info
   // console.log('Session user:', req.session.user);
   // console.log('Locals user:', res.locals.user);
    
   res.render('nearby-shops', { 
     title: 'Nearby Shops', 
     shops,
     // user: req.session.user // explicitly pass user data
    });
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    res.status(500).send('Server error while fetching nearby shops.');
  }
});

/**
 * @route   POST /shops/nearby
 * @desc    Return nearby shops (for API/fetch calls)
 * @body    { latitude, longitude } - optional user coordinates
 */
router.post('/nearby', async (req, res) => {
  try {
    console.log('POST /shops/nearby received:', req.body);
    const shops = await Shop.find().sort({ distance: 1 });
    res.status(200).json({
      message: 'Nearby shops fetched successfully',
      shops,
    });
  } catch (error) {
    console.error('Error fetching nearby shops (POST):', error);
    res.status(500).json({ error: 'Server error while fetching nearby shops.' });
  }
});

module.exports = router;
