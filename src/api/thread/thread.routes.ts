import express from 'express';
import { getThreadsController } from './thread.controllers';

const threadsRouter = express.Router();

threadsRouter.get('/', getThreadsController);

export default threadsRouter;
