const router = require('express').Router();

const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');

const { createUser, login } = require('../controllers/users');
const { loginValidator, createUserValidator } = require('../middlewares/validator');

const NotFoundError = require('../errors/notfound');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Page Not Found'));
});

module.exports = router;