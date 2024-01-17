const rateLimit = require('express-rate-limit');
const { LIMITER_MESSAGE } = require('../utils/codes');

const limiter = rateLimit({
  windowsMS: 15 * 60 * 1000,
  max: 100,
  message: LIMITER_MESSAGE,
  headers: true,
});

module.exports = limiter;
