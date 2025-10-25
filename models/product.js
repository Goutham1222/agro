const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  barcode: String,
  description: String,
  image: String
});

module.exports = mongoose.model('Product', productSchema);
