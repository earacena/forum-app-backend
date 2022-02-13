import { Request, Response } from 'express';
import {
  RequestIdParam,
  RtValidationError,
  Thread as ThreadType,
  ThreadArray as ThreadArrayType,
  ThreadPostRequest,
  ThreadDeleteRequest,
  decodedToken as decodedTokenType,
} from './thread.types';

import { User as UserType } from '../user/user.types';
import User from '../user/user.model';
import Thread from './thread.model';

const getThreadsController = async (_req: Request, res: Response) => {
  try {
    const threads = ThreadArrayType.check(await Thread.findAll());
    res.json(threads);
  } catch (error) {
    // console.error(error);
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' }).end();
        }

        res.status(400).json({ error: error.details }).end();
      }
    }
  }
};

const getThreadByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const thread = ThreadType.check(await Thread.findByPk(id));
    res.status(200).json(thread);
  } catch (error) {
    // console.error(error);
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' }).end();
        }

        res.status(400).json({ error: error.details }).end();
      }
    }
  }
};

const createThreadController = async (req: Request, res: Response) => {
  try {
    const { title, decodedToken } = ThreadPostRequest.check(req.body);

    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));

    if (!user) {
      res.status(400).json({ error: 'user does not exist' });
    }

    const newThread = await Thread.create({
      userId: user.id,
      title,
    });

    res.status(201).json(newThread).end();
  } catch (error) {
    // console.error(error);
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' }).end();
        }

        res.status(400).json({ error: error.details }).end();
      }
    }
  }
};

const deleteThreadByIdController = async (req: Request, res: Response) => {
  try {
    const { decodedToken } = ThreadDeleteRequest.check(req.body);
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));
    const thread = ThreadType.check(await Thread.findByPk(id));

    // console.log(`token: ${token}, postId: ${id}, user: ${user}, post: ${post}`);

    if (user.id !== thread.userId) {
      res
        .status(401)
        .json({ error: "cannot delete another user's thread" })
        .end();
    }

    await Thread.destroy({
      where: {
        id,
      },
    });
    res.status(204).end();
  } catch (error: unknown) {
    // console.error(error);
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' }).end();
        }

        res.status(400).json({ error: error.details }).end();
      }
    }
  }
};

export default {
  getThreadsController,
  getThreadByIdController,
  createThreadController,
  deleteThreadByIdController,
};
