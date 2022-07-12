const logger = require('../../utils/logger');
const { Cart, Menu } = require('../models');

module.exports = {
  Cart() {
    return {
      async addItemToCart(payload) {
        try {
          const { userId } = payload;

          const cart = await Cart.findOne({ userId });

          if (!cart) {
            const cartItem = {
              mealId: payload.mealId,
              quantity: payload.quantity,
              price: payload.price,
              addons: payload.addons || [],
              allergyNote: payload.allergyNote || '',
            };
            const newCart = await Cart.create({
              userId,
              cartItems: [{ ...cartItem }],
              cutlery: payload.cutlery,
              note: payload.note || '',
            });
            return newCart;
          }

          const { cartItems } = cart;
          const { mealId, quantity } = payload;

          const cartItem = cartItems.find((item) => item.mealId.toString() === mealId.toString());

          if (cartItem) {
            cartItem.quantity += quantity;
          } else {
            cartItems.push(payload);
          }

          cart.cartItems = cartItems;
          const updatedCart = await cart.save();

          return updatedCart;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async getCartItems(userId) {
        try {
          const cart = await Cart.findOne({ userId });

          const {
            cartItems, cutlery, note, _id,
          } = cart;

          const foodId = cartItems[0].mealId;
          const menu = await Menu.findOne({ _id: foodId }).populate('vendorId');
          const results = [];
          const data = cartItems.map(async (item) => {
            const { mealId, price, quantity } = item;
            const quantityMealPrice = price * quantity;
            const meal = await Menu.findById(mealId);
            results.push({
              quantityMealPrice,
              name: meal.name,
              image: meal.image,
              addons: item.addons,
              quantity,
              // eslint-disable-next-line no-underscore-dangle
              itemId: item._id,
            });
          });
          await Promise.all(data);
          return {
            cartItems: results,
            cutlery,
            note,
            serviceFee: 50,
            cartTotal: results.reduce((acc, curr) => acc + curr.quantityMealPrice, 0) + 50,
            subTotal: results.reduce((acc, curr) => acc + curr.quantityMealPrice, 0),
            cartId: _id,
            vendorName: menu.vendorId.vendorName || '',
          };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async changeCartItemQuantity(payload) {
        try {
          const { userId, itemId, status } = payload;

          const cart = await Cart.findOne({ userId });

          if (!cart) {
            return { error: 'Cart not found' };
          }

          const { cartItems } = cart;

          // eslint-disable-next-line no-underscore-dangle
          const cartItem = cartItems.find((item) => item._id.toString() === itemId.toString());

          if (!cartItem) {
            return { error: 'Cart item not found' };
          }

          if (status === 'increase') {
            cartItem.quantity += 1;
          } else {
            if (cartItem.quantity === 1) {
              return { error: 'Quantity can not be less then 1' };
            }
            cartItem.quantity -= 1;
          }

          const updatedCart = await cart.save();

          return updatedCart;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async updateCart(payload) {
        try {
          const {
            userId, cutlery, note,
          } = payload;

          const cart = await Cart.findOne({ userId });

          if (!cart) {
            return { error: 'Cart not found' };
          }

          const updateCart = {
            cutlery,
            note,
          };

          const updatedCart = await Cart.findOneAndUpdate({ userId }, updateCart, { new: true });

          return updatedCart;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex.message,
          });
          return { error: ex };
        }
      },

      async deleteCartItem(payload) {
        try {
          const { userId, itemId } = payload;

          const cart = await Cart.findOne({ userId });

          if (!cart) {
            return { error: 'Cart not found' };
          }

          const { cartItems } = cart;

          // eslint-disable-next-line no-underscore-dangle
          const cartItem = cartItems.find((item) => item._id.toString() === itemId.toString());

          if (!cartItem) {
            return { error: 'Cart item not found' };
          }

          cartItems.splice(cartItems.indexOf(cartItem), 1);

          const updatedCart = await cart.save();

          return updatedCart;
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
