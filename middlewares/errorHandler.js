const INTERNAL_SERVER_ERROR_CODE = require('../utils/codes');

module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Internal Server Error' });
  }
  next();
};