import express from 'express';
import threadControllers from './thread.controllers';

const {
  getThreadsController,
} = threadControllers;

const threadsRouter = express.Router();

threadsRouter.get('/', getThreadsController);

export default threadsRouter;
