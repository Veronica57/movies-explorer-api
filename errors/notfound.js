const { NOT_FOUND_CODE, NOT_FOUND_CODE_MESSAGE } = require('../utils/codes');

class NotFoundError extends Error {
  constructor(message = NOT_FOUND_CODE_MESSAGE) {
    super(message);
    this.statusCode = NOT_FOUND_CODE;
    this.message = message;
  }
}

module.exports = NotFoundError;

// 404
