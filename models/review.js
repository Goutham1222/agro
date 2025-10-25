const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Review', reviewSchema);