const mongoose = require('mongoose');

const { Schema } = mongoose;

const searchSchema = new Schema({
  search: {
    type: String,
    required: true,
    index: true,
  },
  count: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Search', searchSchema);
