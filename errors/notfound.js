const { NOT_FOUND_CODE } = require('../utils/codes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_CODE;
    this.message = message;
  }
}

module.exports = NotFoundError;

// 404
