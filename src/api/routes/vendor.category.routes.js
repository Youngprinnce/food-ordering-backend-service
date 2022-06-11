const vendorCategoryRoute = require('../../config/router-config');
const categoryController = require('../controllers/vendor.category.controllers');
// const { authenticate } = require('../middlewares/auth');

/* Post, Delete, and Put Route will be autheticted for admins later */

vendorCategoryRoute.post('/categories/vendors/create', categoryController.createVendorCategory);
vendorCategoryRoute.post('/categories/vendors/createMany', categoryController.createManyVendorCategory);
vendorCategoryRoute.get('/categories/vendors/all', categoryController.allVendorCategories);
vendorCategoryRoute.get('/categories/vendors/:catId', categoryController.getVendorCategory);
vendorCategoryRoute.put('/categories/vendors/:catId', categoryController.updateVendorCategory);
vendorCategoryRoute.delete('/categories/vendors/:catId', categoryController.deleteVendorCategory);

module.exports = vendorCategoryRoute;
