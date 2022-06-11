const axios = require('axios');
const { GOOGLE_API_KEY } = require('../config');

const distanceInMinutes = async (from, to) => {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from}&destinations=${to}&key=${GOOGLE_API_KEY}`,
    );
    return (data.rows[0].elements[0].duration.value) / 60;
  } catch (error) {
    return error;
  }
};

module.exports = distanceInMinutes;
