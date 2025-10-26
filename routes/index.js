const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Farmer Product Verification' });
});
router.get('/scanner', (req, res) => {
  res.render('scanner', { title: 'QR/Barcode Scanner' }); // renders scanner.jade
});


router.get('/about', (req, res) => res.render('about', { title: 'About Us' }));
router.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }));
router.get('/help', (req, res) => res.render('help', { title: 'Help & Support' }));

module.exports = router;
