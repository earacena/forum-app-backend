import { Request, Response } from 'express';

export const getThreadsController = async (_req: Request, res: Response) => {
  res.send('Getting all threads...');
};
