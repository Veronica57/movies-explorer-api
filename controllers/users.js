const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/notfound');
const ConflictError = require('../errors/conflict');
const BadRequestError = require('../errors/badrequest');
const { CREATED_CODE, LOGIN_SUCCESS_MESSAGE, LOGOUT_MESSAGE, CONFLICT_ERROR_CODE_MESSAGE, BAD_REQUEST_CODE_MESSAGE, NOT_FOUND_CODE_MESSAGE } = require('../utils/codes');
const { JWT_SECRET } = require('../utils/config');

// create user
const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
      .then((user) => {
        return res.status(CREATED_CODE).send({
          name: user.name,
          email: user.email,
          _id: user._id,
        });
      })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError(CONFLICT_ERROR_CODE_MESSAGE));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError(BAD_REQUEST_CODE_MESSAGE));
          } else {
            next(err);
        }
      });
  });
};

// user login
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ _id: user._id, message: LOGIN_SUCCESS_MESSAGE });
    })
    .catch(next);
};

// get user by ID
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_CODE_MESSAGE));
      } else {
        next(err);
      }
    });
};

// user logout
const logout = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .then(() => {
      res.clearCookie('jwt', { httpOnly: true, sameSite: true }).send({ message: LOGOUT_MESSAGE });
    })
    .catch(next);
};

// update user by ID
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    })
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_CODE_MESSAGE);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(CONFLICT_ERROR_CODE_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_CODE_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, getUser, updateUser, login, logout,
};
