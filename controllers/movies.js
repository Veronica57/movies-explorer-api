const { CastError, ValidationError } = require('mongoose').Error;
const NotFoundError = require('../errors/notfound');
const BadRequestError = require('../errors/badrequest');
const ForbiddenError = require('../errors/forbidden');

// movie import from schema
const Movie = require('../models/movie');

// create movie
const createMovie = async (req, res, next) => {
    const owner = req.user._id;
    try {
        const movie = await Movie.create({ ...req.body, owner });
        const populatedMovie = await movie.populate('owner');
        res.status(201).send(populatedMovie);
    }
    catch (error) {
        if (error instanceof ValidationError) {
            const errorMessage = Object.values(error.errors)
                .map((err) => err.message)
                .join(', ');
            next(new BadRequestError(`Invalid data ${errorMessage}`));
        } else {
            next(error);
        }
    }
}

// get movies
const getMovies = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const movies = await Movie.find({ owner: userId }).populate['owner'];
        res.send(movies);
    }
    catch (error) {
        next(error);
    }
}

// delete movie by ID
const deleteMovie = async (req, res, next) => {
    const movieId = req.params._id;
    const userId = req.params._id;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            throw new NotFoundError('Movie Not Found');
        }
        if (userId !== movie.owner.toString()) {
            throw new ForbiddenError('Impossible to delete');
        }
        await Movie.deleteOne({ _id: movieId });
        res.send({ message: 'Movie was successfully deleted' });
    }
    catch (error) {
        if (error instanceof CastError) {
            next(new BadRequestError('Invalid movie ID'))
        } else {
            next(error);
        }
    }
};

module.exports = {
    createMovie,
    getMovies,
    deleteMovie,
}