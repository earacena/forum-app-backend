import { Request, Response } from 'express';

export const getPostsController = async (_req: Request, res: Response) => {
  res.send('Getting all posts...');
};
