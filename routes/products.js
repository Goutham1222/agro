const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const path = require('path');
const fs = require('fs');
const { ensureAdmin, ensureAuthenticated } = require('../middleware/auth');

// ✅ Show Add Product Page
router.get('/add', ensureAdmin, (req, res) => {
  res.render('product-add', { title: 'Add Product' });
});

// ✅ Handle Add Product Form
router.post('/add', ensureAdmin, async (req, res) => {
  try {
    const { name, barcode, description, price, manufactureDate, expiryDate } = req.body;

    let imagePath = '';
    if (req.files && req.files.image) {
      const img = req.files.image;
      const uploadPath = path.join(__dirname, '../public/images', img.name);
      await img.mv(uploadPath);
      imagePath = '/images/' + img.name;
    }

    // ✅ Create and save full product details
    await Product.create({
      name,
      barcode,
      description,
      price,
      manufactureDate,
      expiryDate,
      image: imagePath
    });

    res.redirect('/products/list');
  } catch (err) {
    console.error('❌ Error adding product:', err);
    res.render('error', { message: 'Error adding product', error: err });
  }
});

// ✅ Show All Products
router.get('/list', async (req, res) => {
  const products = await Product.find();
  res.render('product-details', { title: 'Product List', products });
});

// ✅ Verify Product by Barcode
router.get('/verify/:barcode', async (req, res) => {
  const product = await Product.findOne({ barcode: req.params.barcode });
  if (!product) return res.render('error', { message: 'Product not found' });
  res.render('product-details', { title: 'Product Details', products: [product] });
});

module.exports = router;
