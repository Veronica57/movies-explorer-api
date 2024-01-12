const { UNAUTHORIZED_ERROR_CODE, UNAUTHORIZED_ERROR_CODE_MESSAGE } = require('../utils/codes');

class UnauthorizedError extends Error {
  constructor(message = UNAUTHORIZED_ERROR_CODE_MESSAGE) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
    this.message = message;
  }
}

module.exports = UnauthorizedError;

// 401
