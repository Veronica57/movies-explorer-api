const BadRequestError = require('../errors/badrequest');
const ConflictError = require('../errors/conflict');
const { INTERNAL_SERVER_ERROR_CODE, INTERNAL_SERVER_ERROR_CODE_MESSAGE } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    const error = new BadRequestError();
    res.status(error.statusCode).send({ message: error.message });
    return;
  }

  if (err.code === 11000) {
    const error = new ConflictError();
    res.status(error.statusCode).send({ message: error.message });
    return;
  }

  const { statusCode = INTERNAL_SERVER_ERROR_CODE, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR_CODE ? INTERNAL_SERVER_ERROR_CODE_MESSAGE : message
  });
  next();
};

module.exports = errorHandler;