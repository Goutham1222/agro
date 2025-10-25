const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: String,
  location: String,
  distance: Number
});

module.exports = mongoose.model('Shop', shopSchema);
