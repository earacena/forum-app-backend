import { Request, Response } from 'express';

export const getUsersController = async (_req: Request, res: Response) => {
  res.send('Getting all users...');
};
