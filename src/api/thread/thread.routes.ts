import express from 'express';
import threadControllers from './thread.controllers';

const {
  getThreadsController,
  getThreadByIdController,
  createThreadController,
} = threadControllers;

const threadsRouter = express.Router();

threadsRouter.get('/', getThreadsController);
threadsRouter.post('/', createThreadController);
threadsRouter.get('/:id', getThreadByIdController);

export default threadsRouter;
