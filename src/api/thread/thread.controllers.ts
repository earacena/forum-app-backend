import { NextFunction, Request, Response } from 'express';
import {
  RequestIdParam,
  Thread as ThreadType,
  ThreadArray as ThreadArrayType,
  ThreadPostRequest,
  ThreadDeleteRequest,
  decodedToken as decodedTokenType,
} from './thread.types';

import { User as UserType } from '../user/user.types';
import User from '../user/user.model';
import Thread from './thread.model';
import Post from '../post/post.model';
import { PostArray } from '../post/post.types';

const getThreadsController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const threads = ThreadArrayType.check(await Thread.findAll());
    res.json(threads);
  } catch (error) {
    next(error);
  }
};

const getThreadByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const thread = ThreadType.check(await Thread.findByPk(id));
    res.status(200).json(thread);
  } catch (error) {
    next(error);
  }
};

const getPostsOfThreadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const posts = PostArray.check(
      await Post.findAll({ raw: true, where: { threadId: id }, order: [['id', 'ASC']] }),
    );
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const createThreadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId, title, decodedToken } = ThreadPostRequest.check(req.body);
    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));

    if (!user) {
      res.status(400).json({ error: 'user does not exist' });
      return;
    }

    const newThread = await Thread.create({
      userId: user.id,
      title,
      topicId,
    });

    res.status(201).json(newThread);
  } catch (error) {
    next(error);
  }
};

const deleteThreadByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { decodedToken } = ThreadDeleteRequest.check(req.body);
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));
    const thread = ThreadType.check(await Thread.findByPk(id));

    if (user.id !== thread.userId) {
      res.status(401).json({ error: "cannot delete another user's thread" });

      return;
    }

    // Delete associated posts that are inaccessible
    await Post.destroy({
      where: {
        threadId: id,
      },
    });

    await Thread.destroy({
      where: {
        id,
      },
    });

    res.status(204).end();
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  getThreadsController,
  getThreadByIdController,
  createThreadController,
  deleteThreadByIdController,
  getPostsOfThreadController,
};
