const mongoose = require('mongoose');

const { Schema } = mongoose;

const cardSchema = new Schema({
  userId: {
    type: Schema.Types.Object,
    ref: 'User',
    required: true,
    index: true,
  },
  cardDetails: [{
    cardNumber: {
      type: String,
      required: true,
    },
    cardExpiryDate: {
      type: String,
      required: true,
    },
    CVV: {
      type: String,
      required: true,
    },
    defaultCard: {
      type: Boolean,
      default: false,
    },
  }],
});

module.exports = mongoose.model('Card', cardSchema);
