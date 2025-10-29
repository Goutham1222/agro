const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: String,
  location: String,
  distance: String
});

module.exports = mongoose.model('Shop', shopSchema);
