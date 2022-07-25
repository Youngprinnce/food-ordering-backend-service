const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema({
  userId: {
    type: Schema.Types.Object,
    ref: 'User',
    required: true,
    index: true,
  },
  addressNickname: {
    type: String,
  },
  apartmentNumber: {
    type: Number,
  },
  street: {
    type: String,
  },
  localGov: {
    type: String,
  },
  building: {
    type: String,
  },
  floor: {
    type: Number,
  },
  extraInfo: {
    type: String,
  },
  geoLocation: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      index: { type: '2dsphere', sparse: false },
    },
  },
  defaultAddress: {
    type: Boolean,
    default: false,
  },
  mobile: {
    type: String,
  },
});

module.exports = mongoose.model('Address', addressSchema);
