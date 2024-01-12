const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const { JWT_SECRET_DEV } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError());
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV !== 'production' ? JWT_SECRET_DEV : JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError());
  }
  req.user = payload;
  return next();
};

module.exports = auth;