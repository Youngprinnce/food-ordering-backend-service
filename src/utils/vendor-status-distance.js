/* eslint-disable camelcase */
const currentDay = require('./current-day');
const distanceInMinutes = require('./distance-in-minutes');

const vendorDetails = async (user, vendor) => {
  const [lat1, long1] = user.geoLocation.coordinates;
  const [lat2, long2] = vendor.geoLocation.coordinates;

  const { opening_hours, isOpen } = vendor;

  const today = currentDay();

  const day = opening_hours[today];
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(/:/g, '');

  let check;
  day.start <= currentTime && day.end >= currentTime ? check = true : check = false;

  const to = `${lat1},${long1}`;
  const from = `${lat2},${long2}`;

  let status;
  // compare status and isOpen but status take more priority
  if (check && isOpen) {
    status = 'open';
  } else if (!check && isOpen) {
    status = 'open';
  } else if (check && !isOpen) {
    status = 'closed';
  } else if (!check && !isOpen) {
    status = 'closed';
  }

  const minutesAway = await distanceInMinutes(from, to);

  return {
    status,
    minutesAway,
  };
};

module.exports = vendorDetails;
