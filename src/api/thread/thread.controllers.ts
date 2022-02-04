import { Request, Response } from 'express';
import Thread from './thread.model';

const getThreadsController = async (_req: Request, res: Response) => {
  const threads = await Thread.findAll();
  res.json(threads);
};

export default {
  getThreadsController,
};
