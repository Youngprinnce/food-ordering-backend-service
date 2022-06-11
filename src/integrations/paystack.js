const axios = require('axios');
const { throwError, logger } = require('../utils');
const {
  PAYSTACK_SECRET_KEY,
  PAYSTACK_BASE_URL,
  CONNECTION_TIMEOUT,
} = require('../config');

const getHeaders = () => ({
  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
});

const axiosInstance = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  timeout: Number(CONNECTION_TIMEOUT),
  headers: getHeaders(),
});

exports.verifyPayment = async (reference) => {
  try {
    const response = await axiosInstance.get(
      `/transaction/verify/${reference}`,
    );
    return {
      status: response.data.data.status,
      message: response.data.data.gateway_response,
      paymentDate: response.data.data.paidAt,
    };
  } catch (e) {
    logger.error('Error verifying payment', e);
    throwError(e.message, 500);
  }
};
