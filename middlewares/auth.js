const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const { JWT_SECRET } = require('../utils/config');
const { UNAUTHORIZED_ERROR_CODE_MESSAGE } = require('../utils/codes');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError(UNAUTHORIZED_ERROR_CODE_MESSAGE));
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError(UNAUTHORIZED_ERROR_CODE_MESSAGE));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
