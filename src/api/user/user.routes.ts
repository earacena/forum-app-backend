import express from 'express';
import { getUsersController } from './user.controllers';

const usersRouter = express.Router();

usersRouter.get('/', getUsersController); 

export default usersRouter;