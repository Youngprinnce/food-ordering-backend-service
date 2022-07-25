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
          const user = await User.findById(userId);
          const results = await Vendor.find({}).populate('vendorCategory');

          const data = [];
          // map the results
          const mappedResults = results.map(async (result) => {
            const { status, minutesAway } = await vendorDetails(user, result);

            const {
              vendorType, vendorCategory, vendorName, vendorBannerImage,
            } = result;
            const object = {
              vendorName,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              vendorCategory: vendorCategory ? vendorCategory[0].name : '',
              minutesAway: typeof minutesAway === 'object' ? 12 : minutesAway,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status,
            };
            data.push(object);
          });
          await Promise.all(mappedResults);
          // randomly select 4 out of mapped results
          const selectedResults = data.sort(() => 0.5 - Math.random()).slice(0, 4);
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
          const user = await User.findById(userId);
          const results = await Vendor.find({}).populate('vendorCategory');

          /*
            TODO: When the orders section is ready, we can get the popular restaurants
          */
          const data = [];
          // map the results
          const mappedResults = results.map(async (result) => {
            const { status, minutesAway } = await vendorDetails(user, result);

            const {
              vendorType, vendorCategory, vendorName, vendorBannerImage,
            } = result;
            const object = {
              vendorName,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              vendorCategory: vendorCategory ? vendorCategory[0].name : '',
              minutesAway: typeof minutesAway === 'object' ? 12 : minutesAway,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status,
            };
            data.push(object);
          });
          await Promise.all(mappedResults);
          // randomly select 4 out of mapped results
          const selectedResults = data.sort(() => 0.5 - Math.random()).slice(0, 4);
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

          const data = [];
          // map the results
          const mappedResults = results.map(async (result) => {
            const { status, minutesAway } = await vendorDetails(user, result);

            if (minutesAway <= 15) {
              const {
                vendorType, vendorCategory, vendorName, vendorBannerImage,
              } = result;
              const object = {
                vendorName,
                vendorId: result._id,
                vendorBannerImage,
                vendorType,
                vendorCategory: vendorCategory ? vendorCategory[0].name : '',
                minutesAway: typeof minutesAway === 'object' ? 12 : minutesAway,
                avgRating: 4.1,
                totalReviews: 100000,
                delivery: 400,
                status,
              };
              data.push(object);
            }
          });
          await Promise.all(mappedResults);
          // randomly select 4 out of mapped results
          const selectedResults = data.sort(() => 0.5 - Math.random()).slice(0, 4);
          return selectedResults;
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
          const user = await User.findById(userId);
          const results = await Vendor.find({}).populate('vendorCategory');
          const data = [];
          // map the results
          const mappedResults = results.map(async (result) => {
            const { status, minutesAway } = await vendorDetails(user, result);

            const {
              vendorType, vendorCategory, vendorName, vendorBannerImage,
            } = result;
            const object = {
              vendorName,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              vendorCategory: vendorCategory ? vendorCategory[0].name : '',
              minutesAway: typeof minutesAway === 'object' ? 12 : minutesAway,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status,
            };
            data.push(object);
          });
          await Promise.all(mappedResults);
          // randomly select 4 out of mapped results
          const selectedResults = data.sort(() => 0.5 - Math.random()).slice(0, 4);
          return selectedResults;
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

      async search(item, userId) {
        try {
          const user = await User.findById(userId);
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

          if (results.length !== 0) {
            const data = [];
            const mappedResults = results.map(async (result) => {
              const { status, minutesAway } = await vendorDetails(user, result);

              const {
                vendorType, vendorCategory, name, vendorBannerImage,
              } = result;
              const object = {
                name,
                vendorId: result._id,
                vendorBannerImage,
                vendorType,
                vendorCategory: vendorCategory ? vendorCategory[0].name : '',
                minutesAway,
                avgRating: 4.1,
                totalReviews: 100000,
                delivery: 400,
                status,
              };
              data.push(object);
            });
            await Promise.all(mappedResults);
            return data;
          }
          return [];
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async searchByCategory(categories, userId) {
        try {
          const user = await User.findById(userId);
          const results = await Vendor.find({
            vendorCategory: { $in: categories },
          }).populate('vendorCategory');

          const data = [];
          const mappedResults = results.map(async (result) => {
            const { status, minutesAway } = await vendorDetails(user, result);

            const {
              vendorType, vendorCategory, name, vendorBannerImage,
            } = result;
            const object = {
              name,
              vendorId: result._id,
              vendorBannerImage,
              vendorType,
              vendorCategory: vendorCategory ? vendorCategory[0].name : '',
              minutesAway,
              avgRating: 4.1,
              totalReviews: 100000,
              delivery: 400,
              status,
            };
            data.push(object);
          });
          await Promise.all(mappedResults);

          return data;
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
          const { status, minutesAway } = await vendorDetails(user, vendor);

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
            vendorCategory: vendorCategory ? vendorCategory[0].name : '',
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

      async restaurantMenuDetails(userId, menuId) {
        try {
          const menu = await Menu.findById(menuId).populate('vendorId');
          const {
            _id,
            amount,
            description,
            image,
            preparation_time,
            addons,
            percentageDiscount,
            discountEndDate,
            vendorId,
          } = menu;

          const user = await User.findById(userId);
          const vendor = await Vendor.findById(vendorId);
          const { status, minutesAway } = await vendorDetails(user, vendor);

          const { start, end } = vendorId.opening_hours[currentDay()];

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
            vendorId: vendor._id,
            addons,
            preparation_time,
            discountedAmount,
            vendorName: vendorId.name,
            vendorBannerImage: vendorId.vendorBannerImage,
            vendorType: vendorId.vendorType,
            vendorCategory: 'African Cuisine',
            minutesAway: 20,
            avgRating: 4.1,
            totalReviews: 100000,
            delivery: 400,
            status,
            minimumOrder: vendorId.minimumOrder || 0,
            openingTime: start,
            closingTime: end,
            avgDeliveryTime: 5,
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
