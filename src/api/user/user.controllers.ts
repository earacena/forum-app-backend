import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  User as UserType,
  UserArray as UserArrayType,
  UserPostRequest,
} from './user.types';
import User from './user.model';
import { RequestIdParam } from '../../common.types';
import Role from '../role/role.model';

const getUsersController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = UserArrayType.check(await User.findAll());
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, username, password } = UserPostRequest.check(req.body);
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = UserType.check(
      await User.create({
        name,
        username,
        passwordHash,
      }),
    );

    await Role.create({
      userId: newUser.id,
      role: 'user',
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const user = UserType.check(await User.findByPk(id));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    await User.destroy({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getUsersController,
  getUserByIdController,
  createUserController,
  deleteUserByIdController,
};
