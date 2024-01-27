const Movie = require('../models/movie');
const NotFoundError = require('../errors/notfound');
const BadRequestError = require('../errors/badrequest');
const ForbiddenError = require('../errors/forbidden');
const ServerError = require('../errors/serverError');

// create movie
const createMovie = (req, res, next) => {
    const {
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        movieId,
        nameRU,
        nameEN,
    } = req.body;
    Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        movieId,
        nameRU,
        nameEN,
        owner: req.user._id,
    })
        .then((movie) => res.status(201).send(movie))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return next(new BadRequestError('Incorrect data'));
            } else {
                return next(new ServerError('Internal Server Error'));
            }
        });
};

// get movies
const getMovies = (req, res, next) => {
    Movie.find({ owner: req.user._id })
        .then((movies) => res.send(movies))
        .catch(next);
};

// delete movie by ID
const deleteMovie = (req, res, next) => {
    Movie.findById(req.params.movieId)
        .then((movie) => {
            if (!movie) {
                throw new NotFoundError('Movie not found');
            }
            const owner = movie.owner.toString();
            if (req.user._id === owner) {
                Movie.deleteOne(movie)
                    .then((movies) => res.send(movies))
                    .catch(next);
            } else {
                throw new ForbiddenError('Impossible to delete');
            }
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return next(new BadRequestError('Incorrect data'));
            } else {
                return next(err);
            }
        });
};

module.exports = {
    getMovies,
    createMovie,
    deleteMovie,
};
