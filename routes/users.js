const userRouter = require('express').Router();
const {
  getCurrentUser, updateUser,
} = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validation');

userRouter.get('/users/me', getCurrentUser);
userRouter.patch('/users/me', updateUserValidator, updateUser);

module.exports = userRouter;
