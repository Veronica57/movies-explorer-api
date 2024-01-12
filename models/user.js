const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/unauthorized');
const { USER_DATA_ERROR_MESSAGE } = require('../utils/codes');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Некорректный email',
    },
  },
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина поля "name" -2'],
    maxlength: [30, 'Максимальная длина поля "name" -30'],
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
  
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(USER_DATA_ERROR_MESSAGE));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError(USER_DATA_ERROR_MESSAGE));
        }
        return user;
      });
    });
};
module.exports = mongoose.model('user', userSchema);
