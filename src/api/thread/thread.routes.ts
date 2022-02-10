import express from 'express';
import threadControllers from './thread.controllers';

const {
  getThreadsController,
  getThreadByIdController,
  createThreadController,
  deleteThreadByIdController,
} = threadControllers;

const threadsRouter = express.Router();

threadsRouter.get('/', getThreadsController);
threadsRouter.post('/', createThreadController);
threadsRouter.get('/:id', getThreadByIdController);
threadsRouter.delete('/:id', deleteThreadByIdController);

export default threadsRouter;
