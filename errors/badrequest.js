const { BAD_REQUEST_CODE } = require('../utils/codes');

class BadRequestError extends Error {
  constructor(message ) {
    super(message);
    this.statusCode = BAD_REQUEST_CODE;
    this.message = message;
  }
}

module.exports = BadRequestError;

// 400
