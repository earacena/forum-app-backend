import { Request, Response } from 'express';
import Thread from './thread.model';

const getThreadsController = async (_req: Request, res: Response) => {
  const threads = await Thread.findAll();
  res.json(threads);
};

const getThreadByIdController = async (req: Request, res: Response) => {
  const thread = await Thread.findByPk(req.params['id']);
  if (thread) {
    res.status(200).json(thread);
  } else {
    res.status(404).end();
  }
};

export default {
  getThreadsController,
  getThreadByIdController,
};
