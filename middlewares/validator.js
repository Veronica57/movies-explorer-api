const { Joi, celebrate } = require('celebrate');
const { validator } = require('validator');
const { BadRequestError } = require('../errors/badrequest');

// const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// validate URL
const validateUrl = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.message(BadRequestError);
  });

// login validation
const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// create user validation
const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

// update user validation
const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// create movie validation
const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: validateUrl,
    trailerLink: validateUrl,
    thumbnail: validateUrl,
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

// delete movie validation
const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});


module.exports = {
  loginValidator,
  createUserValidator,
  createMovieValidator,
  deleteMovieValidator,
  updateUserValidator,
};
