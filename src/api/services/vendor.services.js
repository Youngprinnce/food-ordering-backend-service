/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const validator = require('validator');
const Vendor = require('../models/vendor.models');
const {
  hashManager,
  logger,
  jwtManager,
  sendMail,
  sendSms,
  handleCastErrorExceptionForInvalidObjectId,
  isCastError,
  throwError,
  generateToken,
} = require('../../utils');
const { Menu, Combo, User } = require('../models');

module.exports = {
  Vendor() {
    return {
      async signupStepOne(payload) {
        try {
          const { email, password, mobile } = payload;

          const [check1, check2, check3, check4] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ mobile }),
            Vendor.findOne({ email }),
            Vendor.findOne({ mobile }),
          ]);

          if (check1 || check3) return { error: 'Email already exists' };

          if (check2 || check4) return { error: 'Mobile already exists' };

          payload.mobileToken = generateToken(4);
          payload.emailToken = generateToken(4);
          payload.password = await hashManager().hash(password);
          payload.storeId = `JE${Math.floor(Math.random() * 90000) + 10000}`;

          const newVendor = await Vendor.create(payload);

          await Promise.all([
            sendSms(mobile, payload.mobileToken),
            sendMail(email, 'Verification Token', `${payload.emailToken}`),
          ]);

          return await getResponse(newVendor);
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async verifyAccount(payload) {
        try {
          const { mobileToken, emailToken } = payload;

          const [mobileCheck, emailCheck] = await Promise.all([
            await Vendor.findOne({ mobileToken }),
            await Vendor.findOne({ emailToken }),
          ]);

          if (!mobileCheck && !emailCheck) return { error: 'Invalid Token' };

          let mobileVerified;
          let emailVerified;

          mobileCheck ? mobileVerified = true : mobileVerified = false;
          emailCheck ? emailVerified = true : emailVerified = false;

          const vendor = await Vendor.findOneAndUpdate({
            $or: [
              { mobileToken },
              { emailToken },
            ],
          }, {
            $set: {
              mobileVerified,
              emailVerified,
              mobileToken: null,
              emailToken: null,
            },
          }, {
            new: true,
          });
          return await getResponse(vendor);
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async resendToken(vendorId) {
        try {
          const vendor = await Vendor.findById(vendorId);

          vendor.mobileToken = generateToken(4);
          vendor.emailToken = generateToken(4);

          await Vendor.findOneAndUpdate({ _id: vendor._id }, {
            $set: {
              mobileToken: vendor.mobileToken,
              emailToken: vendor.emailToken,
            },
          });

          await Promise.all([
            sendSms(vendor.mobile, vendor.mobileToken),
            sendMail(vendor.email, 'Verification Token', `${vendor.emailToken}`),
          ]);

          return true;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async signupStepTwo(vendorId, payload) {
        try {
          const vendor = await Vendor.findByIdAndUpdate(vendorId, {
            ...payload,
          }, { new: true });
          return await customResponse(vendor);
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getVendor(vendorId) {
        try {
          const vendor = await Vendor.findById(vendorId).orFail(() => 'Vendor not found');
          return await customResponse(vendor);
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          isCastError(ex) ? handleCastErrorExceptionForInvalidObjectId(ex) : throwError(ex, 404);
        }
      },

      async login(payload) {
        try {
          const { emailorMobile, password } = payload;

          const vendor = await Vendor.findOne({
            $or: [
              { email: emailorMobile },
              { mobile: emailorMobile },
            ],
          }).orFail(() => 'Vendor not found');

          const validatePassword = await hashManager().compare(password, vendor.password);

          if (vendor && validatePassword) {
            return await getResponse(vendor);
          }
          return { error: 'Invalid password or email' };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async forgotPassword({ emailorMobile }) {
        try {
          await Vendor.findOne({ $or: [{ email: emailorMobile }, { mobile: emailorMobile }] }).orFail(() => 'Vendor not found');
          let queryPath;
          // check if he supplied phone or email
          if (validator.isEmail(emailorMobile)) {
            queryPath = 'email';
          } else {
            queryPath = 'mobile';
          }
          // find the user with either email or phone number
          const vendor = await Vendor.findOne({ queryPath: emailorMobile }).orFail(() => 'Vendor not found');

          vendor.passwordResetToken = generateToken(4);
          await vendor.save();

          queryPath === 'mobile' ? await sendSms(emailorMobile, vendor.passwordResetToken) : await sendMail(vendor.email, 'Password Reset Token', `${vendor.passwordResetToken}`);
          return true;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async resetPassword(payload) {
        try {
          const { password, token } = payload;

          const vendor = await Vendor.findOne({ passwordResetToken: token }).orFail(() => 'Vendor not found');

          vendor.password = await hashManager().hash(password);
          vendor.passwordResetToken = null;

          await vendor.save();

          return true;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async updateVendor(payload) {
        try {
          const { vendorId, ...rest } = payload;
          await this.getVendor(vendorId);
          const vendor = await Vendor.findByIdAndUpdate(vendorId, {
            ...rest,
          }, { new: true });
          return await customResponse(vendor);
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async addMenu(payload) {
        try {
          const { vendorId, name } = payload;
          const vendor = await Menu.findOne({ vendorId, name });

          if (vendor) {
            return { error: 'Menu name already exists' };
          }
          const menu = await Menu.create(payload);
          return menu;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getAllMenu(vendorId) {
        try {
          const menu = await Menu.find({ vendorId });
          return menu;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getMenu(vendorId, menuId) {
        try {
          const menu = await Menu.findOne({ vendorId, _id: menuId }).orFail(() => 'Menu not found');
          return menu;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async updateMenu({ vendorId, menuId }, payload) {
        try {
          const menu = await Menu.findOneAndUpdate({ vendorId, _id: menuId }, {
            ...payload,
          }, { new: true }).orFail(() => 'Menu not found');
          return menu;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async addCombo(payload) {
        try {
          const combo = await Combo.create(payload);
          return combo;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getAllCombo(vendorId) {
        try {
          await this.getVendor(vendorId);
          const combo = await Combo.find({ vendorId });
          return combo;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async deleteCombo(comboId, vendorId) {
        try {
          await this.getVendor(vendorId);
          await Combo.findOneAndDelete({ _id: comboId, vendorId }).orFail(() => 'Combo not found');
          return true;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async changePassword(vendorId, { oldPassword, newPassword }) {
        try {
          const vendor = await Vendor.findById(vendorId).orFail(() => 'Vendor not found');
          const validatePassword = await hashManager().compare(oldPassword, vendor.password);
          if (validatePassword) {
            vendor.password = await hashManager().hash(newPassword);
            await vendor.save();
            return true;
          }
          return { error: 'Invalid password' };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async changeEmail(vendorId, { newEmail, password }) {
        try {
          const vendor = await Vendor.findById(vendorId).orFail(() => 'Vendor not found');
          const validatePassword = await hashManager().compare(password, vendor.password);
          if (validatePassword) {
            vendor.email = newEmail;
            await vendor.save();
            return true;
          }
          return { error: 'Invalid password' };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async deleteMenu(menuId, vendorId) {
        try {
          await Menu.findOneAndDelete({ _id: menuId, vendorId }).orFail(() => 'Menu not found');
          return true;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async updateOpeningHours(vendorId, payload) {
        try {
          const vendor = await Vendor.findById(vendorId).orFail(() => 'Vendor not found');
          // replace each keys that matches with the payload
          Object.keys(vendor.opening_hours).forEach((key) => {
            if (payload[key]) {
              vendor.opening_hours[key] = payload[key];
            }
          });
          const updatedResult = await vendor.save();
          return await customResponse(updatedResult);
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },
    };
  },
};

async function getResponse(vendor) {
  const vendorObj = vendor.toObject();
  delete vendorObj.password;
  delete vendorObj.mobileToken;
  delete vendorObj.emailToken;
  delete vendorObj.__v;
  return {
    token: await jwtManager().sign({
      email: vendorObj.email,
      vendorId: vendorObj._id,
    }),
    vendorId: vendorObj._id,
    vendor: vendorObj,
  };
}

async function customResponse(vendor) {
  const vendorObj = vendor.toObject();
  delete vendorObj.password;
  delete vendorObj.mobileToken;
  delete vendorObj.emailToken;
  delete vendorObj.passwordResetToken;
  delete vendorObj.__v;
  return {
    vendorId: vendorObj._id,
    vendor: vendorObj,
  };
}
