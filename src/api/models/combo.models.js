const mongoose = require('mongoose');

const { Schema } = mongoose;

const comboSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor',
  },
  combo: [String],
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Combo', comboSchema);
