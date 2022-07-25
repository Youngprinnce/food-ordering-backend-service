const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'pending',
      'accepted',
      'ready-to-ship',
      'shipped',
      'delivered',
      'cancelled',
      'failed-delivery',
      'returned',
    ],
    default: 'pending',
  },
  orderItems: [{
    mealId: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity can not be less then 1.'],
    },
    addons: [String],
    allergyNote: String,
  }],
  cutlery: {
    type: Boolean,
    default: false,
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  reference: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
  },
  orderId: {
    type: String,
  },
  orderToken: {
    type: String,
  },
  shippingAddress: {
    // type: Schema.Types.ObjectId,
    type: "String",
    ref: 'Address',
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
