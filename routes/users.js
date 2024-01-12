const userRouter = require('express').Router();
const {
  getUser, updateUser,
} = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validation');

userRouter.get('/me', getUser);
userRouter.patch('/me', validateUpdateUser, updateUser);

module.exports = userRouter;
