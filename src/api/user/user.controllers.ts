import { Request, Response } from 'express';
import User from './user.model';

const getUsersController = async (_req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

const getUserByIdController = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params['id']);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).end();
  }
};

export default {
  getUsersController,
  getUserByIdController,
};
