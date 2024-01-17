const { INTERNAL_SERVER_ERROR_CODE, INTERNAL_SERVER_ERROR_CODE_MESSAGE } = require('../utils/codes');

module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: INTERNAL_SERVER_ERROR_CODE_MESSAGE });
  }
  next();
};
