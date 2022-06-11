const { Schema, model } = require('mongoose');

const walletSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
}, { timestamp: true });

const walletModel = model('Wallet', walletSchema);
module.exports = walletModel;
