/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const validator = require('validator');
const {
  logger,
  sendMail,
  sendSms,
  hashManager,
  jwtManager,
  handleCastErrorExceptionForInvalidObjectId,
  isCastError,
  throwError,
  generateToken,
} = require('../../utils');
const { User, Vendor } = require('../models');
const googleAuth = require('../../utils/google-auth');

module.exports = {
  User() {
    return {
      async signup(payload) {
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
          payload.myRefId = `JE${generateToken(5)}`;
          payload.password = await hashManager().hash(password);

          const newUser = await User.create(payload);

          await Promise.all([
            sendMail(email, 'JemiEats', payload.emailToken),
            sendSms(mobile, `${payload.mobileToken} is your verification code`),
          ]);

          return await getResponse(newUser);
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

          let mobileVerified = false;
          let emailVerified = false;
          if ((!mobileToken || mobileToken === '') && emailToken) {
            const emailCheck = await User.findOne({ emailToken });

            if (!emailCheck) return { error: 'Invalid token' };
            emailVerified = true;
          } else {
            const [mobileCheck, emailCheck] = await Promise.all([
              await User.findOne({ mobileToken }),
              await User.findOne({ emailToken }),
            ]);
            if (!mobileCheck || !emailCheck) return { error: 'Invalid token' };
            mobileVerified = true;
            emailVerified = true;
          }

          const user = await User.findOneAndUpdate({
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
          return await getResponse(user);
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async resendToken(userId) {
        try {
          const user = await this.getUser(userId);

          user.mobileToken = generateToken(4);
          user.emailToken = generateToken(4);

          await user.save();

          await Promise.all([
            sendSms(user.mobile, user.mobileToken),
            sendMail(user.email, 'Verification Token', `${user.emailToken}`),
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

      async login(payload) {
        try {
          const { emailorMobile, password } = payload;

          const user = await User.findOne({
            $or: [
              { email: emailorMobile },
              { mobile: emailorMobile },
            ],
          }).orFail(() => 'User not found');

          const validatePassword = await hashManager().compare(password, user.password);

          if (user && validatePassword) {
            return await getResponse(user);
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

      async updateProfile(userId, payload) {
        try {
          await this.getUser(userId);

          const updateUser = await User.findByIdAndUpdate(userId, payload, { new: true });

          return await customResponse(updateUser);
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getUser(userId) {
        try {
          return await User.findById(userId).orFail(() => 'User not found');
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          isCastError(ex) ? handleCastErrorExceptionForInvalidObjectId(ex) : throwError(ex, 401);
        }
      },

      async forgotPassword({ emailorMobile }) {
        try {
          const token = generateToken(4);
          // use findOneAndUpdate. this makes our app more faster and more reliable
          const user = await User.findOneAndUpdate({ $or: [{ email: emailorMobile }, { mobile: emailorMobile }] }, { passwordResetToken: token }).orFail(() => 'User not found');

          validator.isMobilePhone(emailorMobile, 'en-NG') ? await sendSms(emailorMobile, user.passwordResetToken) : await sendMail(user.email, 'Password Reset Token', `${user.passwordResetToken}`);
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

          const hashedPassword = await hashManager().hash(password);
          // only one query to the database. app is more faster.
          await User.findOneAndUpdate({ passwordResetToken: token }, { password: hashedPassword, passwordResetToken: null }).orFail(() => 'User not found');

          return true;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async googleDetails(payload, action) {
        try {
          const details = await googleAuth.googleDetails(payload, action);

          const user = await User.findOne({ email: details.email });
          // if the lenght of alreadyExist is not 0 email is already in use. throw error
          if (user && action === 'register') return { error: 'Email already exist' };

          // if this email is not currently in use and he wants to register
          // return the details gotten from google to him.
          if (!user && action === 'register') return details;

          // if the user wants to login but was not found in the database
          if (user && action === 'login') return await getResponse(user);

          // if the user wants to login and was found in the database log him in
          if (!user && action === 'login') return { error: 'user not found' };
          // if all of this did'nt match the action return details
          return details;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getGoogleUrl(payload) {
        try {
          return await googleAuth.getGoogleUrl(payload);
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

async function getResponse(user) {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.mobileToken;
  delete userObj.emailToken;
  delete userObj.__v;
  return {
    token: await jwtManager().sign({
      email: userObj.email,
      userId: userObj._id,
    }),
    userId: userObj._id,
    user: userObj,
  };
}

async function customResponse(user) {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.mobileToken;
  delete userObj.emailToken;
  delete userObj.__v;
  return {
    userId: userObj._id,
    user: userObj,
  };
}
