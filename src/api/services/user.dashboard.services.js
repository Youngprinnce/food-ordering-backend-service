/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const logger = require('../../utils/logger');
const {
  User, Vendor, Search, Menu,
} = require('../models');
const {
  vendorDetails,
  currentDay,
} = require('../../utils');

module.exports = {
  UserDashboard() {
    return {
      async featuredRestaurants(userId) {
        try {
          // const user = await User.findById(userId);
          const results = await Vendor.find({}).populate('vendorCategory');

          // map the results
          const mappedResults = results.map((result) => {
            // const { status, minutesAway } = vendorDetails(user, result);

            const {
              vendorType, vendorCategory, vendorName, vendorBannerImage,
            } = result;
            console.log(vendorCategory);
            return {
              vendorName,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              vendorCategory: vendorCategory[0].name,
              minutesAway: 5,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status: 'open',
            };
          });
          // randomly select 4 out of mapped results
          const selectedResults = mappedResults.sort(() => 0.5 - Math.random()).slice(0, 4);
          return selectedResults;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async popularRestaurants(userId) {
        try {
          // const user = await User.findById(userId);
          const results = await Vendor.find({}).populate('vendorCategory');

          /*
            TODO: When the orders section is ready, we can get the popular restaurants
          */
          // map the results
          const mappedResults = results.map((result) => {
            // const { status, minutesAway } = vendorDetails(user, result);

            const {
              vendorType, vendorCategory, vendorName, vendorBannerImage,
            } = result;
            return {
              vendorName,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              vendorCategory: vendorCategory[0].name,
              minutesAway: 5,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status: 'open',
            };
          });
          // randomly select 4 out of mapped results
          const selectedResults = mappedResults.sort(() => 0.5 - Math.random()).slice(0, 5);
          return selectedResults;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async closeByRestaurants(userId) {
        try {
          const user = await User.findById(userId);
          const results = await Vendor.find({}).populate('vendorCategory');

          const mappedResults = results.map((result) => {
            // const { status, minutesAway } = vendorDetails(user, result);

            const {
              vendorType, vendorCategory, vendorName, vendorBannerImage,
            } = result;
            return {
              vendorName,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              vendorCategory: vendorCategory[0].name,
              minutesAway: 5,
              avgRating: 3.2,
              totalReviews: 25500,
              delivery: 350,
              status: 'open',
            };
          });
          // randomly select 4 out of mapped results
          const selectedResults = mappedResults.sort(() => 0.5 - Math.random()).slice(0, 5);
          return selectedResults;

          // const closeBy = [];
          // results.forEach((result) => {
          //   const { status, minutesAway } = vendorDetails(user, result);

          //   if (minutesAway <= 15) {
          //     const {
          //       vendorType, vendorCategory, name, vendorBannerImage,
          //     } = result;
          //     const object = {
          //       name,
          //       vendorId: result._id,
          //       vendorBannerImage,
          //       vendorType,
          //       vendorCategory: vendorCategory.name,
          //       minutesAway: 5,
          //       avgRating: 4.1,
          //       totalReviews: 100000,
          //       delivery: 400,
          //       status: 'open',
          //     };
          //     closeBy.push(object);
          //   }
          // });
          // const selectedResults = closeBy.sort(() => 0.5 - Math.random()).slice(0, 5);
          // return selectedResults;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async allRestaurants(userId) {
        try {
          // const user = await User.findById(userId);
          const results = await Vendor.find({}).populate('vendorCategory');
          console.log(results);

          const mappedResults = results.map((result) => {
            // const { status, minutesAway } = vendorDetails(user, result);

            const {
              vendorType, vendorCategory, vendorName, vendorBannerImage,
            } = result;
            return {
              vendorName,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              vendorCategory: vendorCategory[0].name,
              minutesAway: 5,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status: 'open',
            };
          });
          return mappedResults;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async popularSearches() {
        try {
          // Get all popular searches with highest number in count field
          // Get the top 9 from the results
          const results = await Search.find({}).sort({ count: -1 }).limit(9);
          return results;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async search(item) {
        try {
          const searchItem = item.toLowerCase();
          const searchExists = await Search.findOne({
            search: searchItem,
          });
          if (searchExists) {
            searchExists.count += 1;
            await searchExists.save();
          } else {
            await Search.create({
              search: searchItem,
            });
          }
          const results = await Vendor.find({
            name: { $regex: searchItem, $options: '$i' },
          }).populate('vendorCategory');

          const mappedResults = results.map((result) => {
            // const { status, minutesAway } = vendorDetails(user, result);

            const {
              vendorType, vendorCategory, name, vendorBannerImage,
            } = result;
            return {
              name,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              // vendorCategory: vendorCategory.name,
              minutesAway: 5,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status: 'open',
            };
          });
          return mappedResults;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async searchByCategory(categories) {
        try {
          const results = await Vendor.find({
            vendorCategory: { $in: categories },
          }).populate('vendorCategory');
          const mappedResults = results.map((result) => {
            // const { status, minutesAway } = vendorDetails(user, result);

            const {
              vendorType, vendorCategory, name, vendorBannerImage,
            } = result;
            return {
              name,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              // vendorCategory: vendorCategory.name,
              minutesAway: 5,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status: 'open',
            };
          });
          return mappedResults;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async restaurantDetails({ userId, vendorId }) {
        try {
          const user = await User.findById(userId);
          const vendor = await Vendor.findById(vendorId);
          const { status, minutesAway } = vendorDetails(user, vendor);

          const {
            vendorType,
            vendorCategory,
            vendorName,
            vendorBannerImage,
            website,
            socialMedia,
            address,
            minimumOrder,
            opening_hours,
            schedule_period,
          } = vendor;
          const { start, end } = opening_hours[currentDay()];

          const meals = await Menu.find({ vendorId });

          const mappedMeals = meals.map((meal) => {
            const {
              _id,
              amount,
              description,
              image,
            } = meal;
            return {
              name: meal.name,
              amount,
              description,
              image,
              menuId: _id,
            };
          });
          return {
            vendorName,
            vendorId: vendor._id,
            vendorBannerImage,
            vendorType,
            vendorCategory: vendorCategory[0].name,
            minutesAway,
            avgRating: 4.1,
            totalReviews: 100000,
            delivery: 400,
            status,
            website,
            socialMedia,
            address,
            minimumOrder: minimumOrder || 0,
            openingTime: start,
            closingTime: end,
            avgDeliveryTime: 5,
            scheduleOrder: schedule_period.schedule,
            meals: mappedMeals,
          };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async restaurantMenus(vendorId) {
        try {
          const meals = await Menu.find({ vendorId });

          const mappedMeals = meals.map((meal) => {
            const {
              _id,
              amount,
              description,
              image,
              outOfStock,
            } = meal;
            return {
              name: meal.name,
              amount,
              description,
              image,
              menuId: _id,
              vendorId,
              outOfStock,
            };
          });
          return mappedMeals;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async restaurantMenuDetails(vendorId, menuId) {
        try {
          const menu = await Menu.findById(menuId);
          const {
            _id,
            amount,
            description,
            image,
            preparation_time,
            addons,
            percentageDiscount,
            discountEndDate,
          } = menu;

          let discountedAmount = 0;
          if (percentageDiscount && percentageDiscount > 0) {
            const currentDate = new Date();
            const datedDiscount = new Date(discountEndDate);
            if (currentDate < datedDiscount) {
              const discount = (amount * percentageDiscount) / 100;
              discountedAmount = amount - discount;
            }
          }
          return {
            name: menu.name,
            amount,
            description,
            image,
            menuId: _id,
            vendorId,
            addons,
            preparation_time,
            discountedAmount,
          };
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
