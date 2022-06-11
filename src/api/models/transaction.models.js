const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
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
    default: 'pending',
    enum: ['success', 'failed', 'pending', 'cancelled'],
  },
  type: {
    type: String,
    required: true,
    enum: ['credit', 'debit', 'withdrawal'],
  },
  reference: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
