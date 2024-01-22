const { FORBIDDEN_ERROR_CODE } = require('../utils/codes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR_CODE;
    this.message = message;
  }
}

module.exports = ForbiddenError;

// 403
