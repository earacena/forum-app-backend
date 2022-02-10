import { Request, Response } from 'express';
import { UserRequest } from '../../types';
import User from './user.model';

const getUsersController = async (_req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

const createUserController = async (req: Request, res: Response) => {
  const { name, username } = UserRequest.check(req.body);
  const newUser = await User.create({
    name,
    username,
  });
  res.status(201).json(newUser);
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
  createUserController,
};
