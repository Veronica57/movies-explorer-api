const { Joi, celebrate } = require('celebrate');

const { BadRequestError } = require('../errors/badrequest');

// const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const validateUrl = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.message(BadRequestError);
  });

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email()
  })
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: validateUrl,
    trailerLink: validateUrl,
    thumbnail: validateUrl,
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required()
  })
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
  })
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30)
  })
});

module.exports = {
  validateUpdateUser,
  validateCreateMovie,
  validateDeleteMovie,
  validateLogin,
  validateCreateUser
};