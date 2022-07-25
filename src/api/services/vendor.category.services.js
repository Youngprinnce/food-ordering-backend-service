const logger = require('../../utils/logger');
const { VendorCategory } = require('../models');
const { handleCastErrorExceptionForInvalidObjectId, isCastError, throwError } = require('../../utils');

module.exports = {
  VendorCategory() {
    return {
      async createVendorCategory(category) {
        try {
          const newCategory = await VendorCategory.create({ category });
          return newCategory;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async createManyVendorCategory(categories) {
        try {
          const newCategories = await VendorCategory.insertMany(categories);
          return newCategories;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async allVendorCategories() {
        try {
          return await VendorCategory.find({});
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getVendorCategory(catId) {
        try {
          return await VendorCategory.findById(catId).orFail(() => 'Category not found');
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          isCastError(ex) ? handleCastErrorExceptionForInvalidObjectId(ex) : throwError(ex);
        }
      },

      async updateVendorCategory(payload) {
        try {
          await this.getCategory(payload.id);
          return await VendorCategory.findByIdAndUpdate(
            payload.id,
            { category: payload.category },
            { new: true },
          );
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async deleteVendorCategory(id) {
        try {
          await this.getCategory(id);
          await VendorCategory.findByIdAndDelete(id);
          return true;
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
