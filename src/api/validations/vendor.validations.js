const Joi = require('joi');

const stepTwoSignupSchema = Joi.object().keys({
  role: Joi.string().valid('owner', 'co-owner', 'admin', 'manager').required(),
  vendorMobileNumbers: Joi.array().items(Joi.string().required()).required(),
  vendorName: Joi.string().required(),
  vendorType: Joi.string().length(24).required(),
  vendorCategory: Joi.array().items(Joi.string().length(24).required()).required(),
  website: Joi.string().uri(),
  socialMedia: Joi.object().keys({
    facebook: Joi.string(),
    instagram: Joi.string(),
    twitter: Joi.string(),
    website: Joi.string(),
  }),
  opening_hours: Joi.object().keys({
    monday: Joi.object().keys({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
    tuesday: Joi.object().keys({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
    wednesday: Joi.object().keys({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
    thursday: Joi.object().keys({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
    friday: Joi.object().keys({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
    saturday: Joi.object().keys({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
    sunday: Joi.object().keys({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
  }).required(),
  schedule_period: Joi.object().keys({
    schedule: Joi.boolean().default(false),
    notice_period: Joi.number().default(0),
  }),
  vendorBankDetails: Joi.object().keys({
    bankName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    accountHolderName: Joi.string().required(),
  }),
  vendorMenu: Joi.any(),
  taxIdNumber: Joi.string(),
  formOfIdentification: Joi.string().valid('passport', 'driving_license', 'national_id'),
  identificationNumber: Joi.string(),
  address: Joi.string(),
  geoLocation: Joi.object().keys({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array().items(Joi.number()),
  }),
  vendorLogo: Joi.any(),
  vendorBannerImage: Joi.any(),
  vendorCertificateImage: Joi.any(),
  identificationImage: Joi.any(),
});

const updateStore = Joi.object().keys({
  firstname: Joi.string(),
  lastname: Joi.string(),
  address: Joi.string(),
  role: Joi.string().valid('owner', 'co-owner', 'admin', 'manager'),
  vendorMobileNumbers: Joi.array().items(Joi.string()),
  vendorName: Joi.string(),
  website: Joi.string(),
  socialMedia: Joi.object().keys({
    facebook: Joi.string(),
    instagram: Joi.string(),
    twitter: Joi.string(),
  }),
  notifications: Joi.boolean(),
  minimumOrder: Joi.number(),
  isOpen: Joi.boolean(),
  schedule_period: Joi.object().keys({
    schedule: Joi.boolean().default(false),
    notice_period: Joi.number().default(0),
  }),
  geoLocation: Joi.object().keys({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array().items(Joi.number()),
  }),
});

const addMenu = Joi.object().keys({
  category: Joi.string().required(),
  name: Joi.string().min(2).max(50).required(),
  amount: Joi.number().required(),
  image: Joi.any(),
  description: Joi.string().required(),
  preparation_time: Joi.string(),
  addons: Joi.array().items(Joi.object().keys({
    section_title: Joi.string(),
    addon: Joi.array().items(Joi.object().keys({
      name: Joi.string().required(),
      price: Joi.number().required().default(0),
    })),
    selectable: Joi.number().required(),
  })).required(),
});

const updateMenu = Joi.object().keys({
  discountEndDate: Joi.date(),
  discountStartingPrice: Joi.number(),
  percentageDiscount: Joi.number(),
  outOfStock: Joi.boolean(),
  category: Joi.string(),
  name: Joi.string().min(2).max(50),
  amount: Joi.number(),
  image: Joi.any(),
  description: Joi.string(),
  preparation_time: Joi.string(),
  addons: Joi.array().items(Joi.object().keys({
    section_title: Joi.string(),
    addon: Joi.array().items(Joi.object().keys({
      name: Joi.string(),
      price: Joi.number().default(0),
    })),
    selectable: Joi.number(),
  })),
});

const addCombo = Joi.object().keys({
  name: Joi.string().min(2).max(50).required(),
  price: Joi.number().required(),
  combo: Joi.array().items(Joi.string().required()).required(),
});

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError = new Error('Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length');

const changePassword = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().regex(strongPasswordRegex).error(stringPassswordError).required(),
});

const changeEmail = Joi.object().keys({
  newEmail: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateOpeningHours = Joi.object().keys({
  monday: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  tuesday: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  wednesday: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  thursday: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  friday: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  saturday: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  sunday: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
});

module.exports = {
  stepTwoSignupSchema,
  updateStore,
  addMenu,
  updateMenu,
  addCombo,
  changePassword,
  changeEmail,
  updateOpeningHours,
};
