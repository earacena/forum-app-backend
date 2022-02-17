import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  User as UserType,
  UserArray as UserArrayType,
  UserPostRequest,
  RtValidationError,
} from './user.types';
import User from './user.model';
import { RequestIdParam } from '../post/post.types';

const getUsersController = async (_req: Request, res: Response) => {
  try {
    const users = UserArrayType.check(await User.findAll());
    res.json(users);
  } catch (error) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        res.status(400).json({ error: error.details });
        return;
      }
    }

    res.status(404).json({ error: 'users not found' });
  }
};

const createUserController = async (req: Request, res: Response) => {
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

    res.status(201).json(newUser);
  } catch (error) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        res.status(400).json({ error: error.details });
        return;
      }
    }

    res.status(400).json({ error: 'invalid request' });
  }
};

const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const user = UserType.check(await User.findByPk(id));
    res.status(200).json(user);
  } catch (error) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        res.status(400).json({ error: error.details });
        return;
      }

      res.status(400).json({ error: 'invalid id given' });
      return;
    }

    res.status(404).json({ error: 'user not found' });
  }
};

const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    await User.destroy({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' });
          return;
        }

        res.status(400).json({ error: error.details });
        return;
      }
    }

    res.status(400).json({ error: 'invalid request' });
  }
};

export default {
  getUsersController,
  getUserByIdController,
  createUserController,
  deleteUserByIdController,
};
