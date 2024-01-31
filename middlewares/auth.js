const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const { NODE_ENV, JWT_SECRET ,JWT_SECRET_DEV } = require('../utils/config');

module.exports = (req, res, next) => {
  //get token from cookies
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('Authorization is required'));
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  }
  catch (error) {
    return next(new UnauthorizedError('Authorization is required'));
  }
  req.user = payload;
  return next();
};
