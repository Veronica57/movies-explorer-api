const { CONFLICT_CODE } = require('../utils/codes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_CODE;
    this.message = message;
  }
}

module.exports = ConflictError;

// 409
