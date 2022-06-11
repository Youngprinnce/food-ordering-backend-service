const mongoose = require('mongoose');

const { Schema } = mongoose;

const favouriteMealSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('favouriteMeal', favouriteMealSchema);
