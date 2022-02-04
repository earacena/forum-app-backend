import express from 'express';
import userControllers from './user.controllers';

const { getUsersController } = userControllers;

const usersRouter = express.Router();

usersRouter.get('/', getUsersController);

export default usersRouter;
