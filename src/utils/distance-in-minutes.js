const axios = require('axios');
const { GOOGLE_API_KEY } = require('../config');

const distanceInMinutes = async (from, to) => {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from}&destinations=${to}&key=${GOOGLE_API_KEY}`,
    );
    console.log(data);
    return (data.rows[0].elements[0].duration.value) / 60;
  } catch (error) {
    return error;
  }
};

// const to = '114.5110151,-8.45973';
// const from = '6.514193,3.308678';

// console.log(distanceInMinutes(from, to).then((data) => console.log(data)));

module.exports = distanceInMinutes;
