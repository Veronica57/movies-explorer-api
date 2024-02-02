const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

const { createUser, login, logout } = require('../controllers/users');

const { createUserValidator, loginValidator } = require('../middlewares/validator');

const NotFoundError = require('../errors/notfound');

// user create
router.post('/signup', createUserValidator, createUser);

//user login
router.post('/signin', loginValidator, login);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('/signout', auth, logout);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Page Not Found'));
});

module.exports = router;