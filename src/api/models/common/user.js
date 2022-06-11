const user = {
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    sparse: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  mobileVerified: {
    type: Boolean,
    default: false,
  },
  mobileToken: {
    type: String,
  },
  emailToken: {
    type: String,
  },
  address: {
    type: String,
  },
  geoLocation: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      index: { type: '2dsphere', sparse: false },
    },
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  passwordResetToken: {
    type: String,
  },
};

module.exports = user;
