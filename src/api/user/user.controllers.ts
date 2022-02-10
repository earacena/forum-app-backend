import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserPostRequest } from './user.types';
import User from './user.model';

const getUsersController = async (_req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

const createUserController = async (req: Request, res: Response) => {
  const { name, username, password } = UserPostRequest.check(req.body);

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    username,
    passwordHash,
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

const deleteUserByIdController = async (req: Request, res: Response) => {
  await User.destroy({
    where: {
      id: req.params['id'],
    },
  });

  res.status(204).end();
};

export default {
  getUsersController,
  getUserByIdController,
  createUserController,
  deleteUserByIdController,
};
