const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

const { createUser, login, logout} = require('../controllers/users');
const { validateLogin, validateCreateUser} = require('../middlewares/validation');

const NotFoundError = require('../errors/notfound');
const { PAGE_NOT_FOUND_MESSAGE } = require('../utils/codes');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signup', logout)

router.use((req, res, next) => {
  next(new NotFoundError(PAGE_NOT_FOUND_MESSAGE));
});

module.exports = router;
