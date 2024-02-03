const NotFoundError = require('../errors/notfound');
const ForbiddenError = require('../errors/forbidden');

// movie import from schema
const Movie = require('../models/movie');

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
    movieId
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
    owner
  })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};
  
// get movies
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(() => new NotFoundError('Movie Not Found'))
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

// delete movie by ID
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Movie Not Found');
      else if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Impossible to delete');
      } else {
        return movie.deleteOne().then(() => res.send(movie));
      }
    })
    .catch(next);
};

module.exports = {
    createMovie,
    getMovies,
    deleteMovie,
};
