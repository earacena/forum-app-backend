import express from 'express';
import userControllers from './user.controllers';

const {
  getUsersController,
  getUserByIdController,
  createUserController,
  deleteUserByIdController,
} = userControllers;

const usersRouter = express.Router();

usersRouter.get('/', getUsersController);
usersRouter.post('/', createUserController);
usersRouter.get('/:id', getUserByIdController);
usersRouter.delete('/:id', deleteUserByIdController);

export default usersRouter;
