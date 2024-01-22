const userRouter = require('express').Router();
const {
  getUser, updateUser,
} = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validator');

userRouter.get('/users/me', getUser);
userRouter.patch('/users/me', updateUserValidator, updateUser);

module.exports = userRouter;