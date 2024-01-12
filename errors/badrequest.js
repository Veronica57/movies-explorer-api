const { BAD_REQUEST_CODE, BAD_REQUEST_CODE_MESSAGE } = require('../utils/codes');

class BadRequestError extends Error {
  constructor(message = BAD_REQUEST_CODE_MESSAGE) {
    super(message);
    this.statusCode = BAD_REQUEST_CODE;
    this.message = message;
  }
}

module.exports = BadRequestError;

// 400
