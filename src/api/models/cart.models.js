const mongoose = require('mongoose');

const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [
    {
      mealId: String,
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.'],
      },
      price: {
        type: Number,
        required: true,
      },
      addons: [String],
      allergyNote: String,
    },
  ],
  cutlery: {
    type: Boolean,
    default: false,
  },
  note: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('cart', cartSchema);
