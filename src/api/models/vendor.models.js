const mongoose = require('mongoose');
const user = require('./common/user');

const { Schema } = mongoose;

const vendorSchema = new Schema({
  ...user,
  role: {
    type: String,
    enum: ['owner', 'co-owner', 'admin', 'manager'],
  },
  vendorName: {
    type: String,
  },
  vendorType: {
    type: String,
    enum: ['restaurants', 'coffee-shop', 'grocery-shop', 'fast-food', 'drinks-vendor', 'home-based-kitchen', 'hotel-restaurants'],
  },
  vendorCategory: [{
    type: Schema.Types.ObjectId,
    ref: 'VendorCategory',
    index: true,
  }],
  vendorMobileNumbers: [
    String,
  ],
  website: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
  },
  opening_hours: {
    monday: {
      start: String,
      end: String,
    },
    tuesday: {
      start: String,
      end: String,
    },
    wednesday: {
      start: String,
      end: String,
    },
    thursday: {
      start: String,
      end: String,
    },
    friday: {
      start: String,
      end: String,
    },
    saturday: {
      start: String,
      end: String,
    },
    sunday: {
      start: String,
      end: String,
    },
  },
  schedule_period: {
    schedule: {
      type: Boolean,
      default: false,
    },
    notice_period: Number,
  },
  vendorBankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountHolderName: { type: String },
  },
  vendorLogo: {
    type: String,
  },
  vendorBannerImage: {
    type: String,
  },
  vendorMenu: {
    type: String,
  },
  taxIdNumber: {
    type: String,
  },
  vendorCertificateImage: {
    type: String,
  },
  identificationImage: {
    type: String,
  },
  identificationNumber: {
    type: String,
  },
  formOfIdentification: {
    type: String,
    enum: ['passport', 'driving_license', 'national_id'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  storeId: {
    type: String,
  },
  minimumOrder: Number,
  notifications: {
    type: Boolean,
    default: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vendor', vendorSchema);
