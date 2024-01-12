const { CONFLICT_CODE, CONFLICT_ERROR_CODE_MESSAGE } = require('../utils/codes');

class ConflictError extends Error {
  constructor(message = CONFLICT_ERROR_CODE_MESSAGE) {
    super(message);
    this.statusCode = CONFLICT_CODE;
    this.message = message;
  }
}

module.exports = ConflictError;

// 409
