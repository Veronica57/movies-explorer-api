const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/badrequest');
const NotFoundError = require('../errors/notfound');
const ConflictedError = require('../errors/conflict');
const { JWT_SECRET_DEV } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const { CREATED_CODE } = require('../utils/codes');

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(CREATED_CODE).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictedError('User already exists'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('User._id Not Found');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('User Not Found'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('User._id Not Found');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictedError('User already exists'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, getCurrentUser, updateUser, login,
};
