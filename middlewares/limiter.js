const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowsMS: 15 * 60 * 1000,
  max: 1000,
});

module.exports = limiter;
