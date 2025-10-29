const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  barcode: String,
  manufactureDate: Date,
  expiryDate: Date,
  image: String
});

module.exports = mongoose.model('Product', productSchema);
