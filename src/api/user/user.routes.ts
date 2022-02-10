import express from 'express';
import userControllers from './user.controllers';

const { getUsersController, getUserByIdController, createUserController } = userControllers;

const usersRouter = express.Router();

usersRouter.get('/', getUsersController);
usersRouter.get('/:id', getUserByIdController);
usersRouter.post('/', createUserController);

export default usersRouter;
