const Movie = require('../models/movie');
const NotFoundError = require('../errors/notfound');
const ForbiddenError = require('../errors/forbidden');
const BadRequestError = require('../errors/badrequest');
const { BAD_REQUEST_CODE_MESSAGE, NOT_FOUND_CODE_MESSAGE, FORBIDDEN_ERROR_CODE_MESSAGE } = require('../utils/codes');

//get movies
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(() => new NotFoundError())
    .then((movies) => res.send(movies))
    .catch(next);
};

// create movie
const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_CODE_MESSAGE));
      } else {
        next(err);
      }
    });
};

// delete movie by ID
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_CODE_MESSAGE);
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new ForbiddenError(FORBIDDEN_ERROR_CODE_MESSAGE);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_CODE_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
