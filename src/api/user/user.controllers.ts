import { Request, Response } from 'express';
import User from './user.model';

const getUsersController = async (_req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

export default {
  getUsersController,
};
