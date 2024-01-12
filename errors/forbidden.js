const { FORBIDDEN_ERROR_CODE, FORBIDDEN_ERROR_CODE_MESSAGE } = require('../utils/codes');

class ForbiddenError extends Error {
  constructor(message = FORBIDDEN_ERROR_CODE_MESSAGE) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR_CODE;
    this.message = message;
  }
}

module.exports = ForbiddenError;

// 403
