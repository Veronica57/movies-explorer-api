const { CONFLICT_CODE } = require('../utils/codes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_CODE;
  }
}

module.exports = ConflictError;

// 409
