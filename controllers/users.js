const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/badrequest');
const NotFoundError = require('../errors/notfound');
const ConflictedError = require('../errors/conflict');
const UnauthorizedError = require('../errors/unauthorized');
const ServerError = require('../errors/serverError');
const { JWT_SECRET_DEV } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const SALT_ROUND = 10;

// create user
const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, SALT_ROUND)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictedError('User already exists'));
      } else if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect data'));
      } else {
        return next(new ServerError('Internal Server Error'));
      }
    });
};

// user login
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );
      res.sattus(201).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Invalid email or password'))
    });
};

// get user by ID
const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      } else {
        return res.status(200).send({ data: user.toObject() });
    }
    })
    .catch((err) => {
      if (err.message === 'CastError') {
      return next(new BadRequestError('Incorrect data'))
      } else {
        next(err)
    }
  })
};

// update user by ID
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
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User Not Found');
      }
      return res.status(200).send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, getUser, updateUser, login,
};