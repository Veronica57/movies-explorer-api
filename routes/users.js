const userRouter = require('express').Router();
const {
  getUser, updateUser,
} = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validation');

userRouter.get('/me', getUser);
userRouter.patch('/me', updateUserValidator, updateUser);

module.exports = userRouter;
