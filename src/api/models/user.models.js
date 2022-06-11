const mongoose = require('mongoose');
const user = require('./common/user');

const { Schema } = mongoose;

const userSchema = new Schema({
  ...user,
  offers: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  myRefId: {
    type: String,
    required: true,
  },
  referralId: {
    type: String,
  },
  favouriteMeals: [{
    type: Schema.Types.ObjectId,
    ref: 'favouriteMeal',
    index: true,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
