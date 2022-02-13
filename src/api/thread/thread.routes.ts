import express from 'express';
import threadControllers from './thread.controllers';
import auth from '../../middleware/authenticate';

const {
  getThreadsController,
  getThreadByIdController,
  createThreadController,
  deleteThreadByIdController,
} = threadControllers;

const threadsRouter = express.Router();

threadsRouter.get('/', getThreadsController);
threadsRouter.post('/', auth, createThreadController);
threadsRouter.get('/:id', getThreadByIdController);
threadsRouter.delete('/:id', auth, deleteThreadByIdController);

export default threadsRouter;
