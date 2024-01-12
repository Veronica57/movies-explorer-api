const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const NotFoundError = require('../errors/notfound');

const { JWT_SECRET_DEV } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const { CREATED_CODE, LOGIN_SUCCESS_MESSAGE, LOGOUT_MESSAGE  } = require('../utils/codes');


const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, email, password: hash })
      .then((user) => {
        const returnUser = user.toObject();
        delete returnUser.password;
        res.status(CREATED_CODE).send(returnUser);
      })
      .catch(next);
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV !== 'production' ? JWT_SECRET_DEV: JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true
      });
      res.send({ _id: user._id, message: LOGIN_SUCCESS_MESSAGE });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError())
    .then((user) => res.send(user))
    .catch(next);
};


const logout = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .then(() => {
      res.clearCookie('jwt', { httpOnly: true, sameSite: true }).send({ message: LOGOUT_MESSAGE  });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError())
    .then((user) => res.send(user))
    .catch(next);
};


module.exports = {
  createUser, getUser, updateUser, login, logout,
};
