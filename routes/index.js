const auth = require('../middlewares/auth');
const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/notfound');
const cors = require('../middlewares/cors');
const { createUser, login } = require('../controllers/users');
const { loginValidator, createUserValidator } = require('../middlewares/validator');

// router.use(cors);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server is going to crash');
  }, 0);
});

router.post('/signup', createUserValidator, createUser); // create user
router.post('/signin', loginValidator, login); // login user

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Page Not Found'));
});

module.exports = router;