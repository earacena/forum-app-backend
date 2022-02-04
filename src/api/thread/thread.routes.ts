import express from 'express';
import threadControllers from './thread.controllers';

const {
  getThreadsController,
  getThreadByIdController,
} = threadControllers;

const threadsRouter = express.Router();

threadsRouter.get('/', getThreadsController);
threadsRouter.get('/:id', getThreadByIdController);

export default threadsRouter;
