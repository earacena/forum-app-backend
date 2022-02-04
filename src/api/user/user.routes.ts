import express from 'express';
import userControllers from './user.controllers';

const { getUsersController, getUserByIdController } = userControllers;

const usersRouter = express.Router();

usersRouter.get('/', getUsersController);
usersRouter.get('/:id', getUserByIdController);

export default usersRouter;
