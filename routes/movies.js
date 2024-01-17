const movieRouter = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validation');

movieRouter.get('/', getMovies);
movieRouter.post('/', createMovieValidator, createMovie);
movieRouter.delete('/:id', deleteMovieValidator, deleteMovie);

module.exports = movieRouter;
