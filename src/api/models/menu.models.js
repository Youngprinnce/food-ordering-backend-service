const mongoose = require('mongoose');

const { Schema } = mongoose;

const menuSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor',
  },
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  preparation_time: {
    type: String,
  },
  image: {
    type: String,
  },
  addons: [{
    section_title: String,
    addon: [
      {
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    selectable: Number,
  }],
  outOfStock: {
    type: Boolean,
    default: false,
  },
  percentageDiscount: {
    type: Number,
  },
  discountEndDate: {
    type: Date,
  },
  discountStartingPrice: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Menu', menuSchema);
