const { UNAUTHORIZED_ERROR_CODE } = require('../utils/codes');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
    this.message = message;
  }
}

module.exports = UnauthorizedError;

// 401
