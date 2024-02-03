const { ValidationError } = require('mongoose').Error;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../errors/badrequest');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/notfound');

const SALT_ROUND = 10;
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/config');

// create user
const createUser = async (req, res, next) => {
    const { email, password, name } = req.body;
    try {
        const securedPassword = await bcrypt.hash(password, SALT_ROUND);
        const user = await User.create({ email, password: securedPassword, name });
        setToken(res, user);
        const userRes = user.toObject();
        delete userRes.password;
        res.status(201).send({data: userRes})
    }
    catch (error) {
        if (error.code === 11000) {
            next(new ConflictError('User already exists'));
            return;
        }
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

// user login
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findUserByCredentials(email, password);
        setToken(res, user);
        res.send({ _id: user._id, message: 'Authorization is completed' });
    }
    catch (error) {
        next(error);
    }
}

// user logout
const logout = (req, res, next) => {
    const { email } = req.body;
    User.findOne({ email })
        .then(() => {
            res.clearCookie('jwt', { httpOnly: true, sameSite:'None', secure: true }).send({ message: 'Logout is completed' });
        })
        .catch(next);
};

// update user data
const updateUser = async (req, res, next) => {
    const userId = req.user._id;
    const { email, name } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { email, name },
            {
                new: true,
                runValidators: true,
            }
        );
        if (!user) {
            throw new NotFoundError('User Not Found');
        }
        res.send(user);
    } 
    catch (error) {
        if (error.code === 11000) {
            next(new ConflictError('User already exists'));
            return;
        }
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

// get current user data
const getUser = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User Not Found')
        }
        res.send(user);
    }
    catch (error) {
        next(error);
    }
}

// set token && cookie
const setToken = (res, user) => {
    const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
};

module.exports = {
    getUser,
    createUser,
    login,
    logout,
    updateUser,
};