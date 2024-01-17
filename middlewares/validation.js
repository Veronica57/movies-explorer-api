const { Joi, celebrate } = require('celebrate');
const { validator } = require('validator');
const { BadRequestError } = require('../errors/badrequest');

// validate URL
const validateUrl = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.message(BadRequestError);
  });

// login user validation
const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
});

// create user validation
const createUserValidator = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
});

// create movie valiation
const createMovieValidator = celebrate({
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
    nameEN: Joi.string().required(),
  }),
});

// delete movie validation
const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

// update user validation
const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false }}),
  }),
}); 

module.exports = {
  loginValidator,
  createUserValidator,
  createMovieValidator,
  deleteMovieValidator,
  updateUserValidator,
};
