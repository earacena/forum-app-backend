import { Request, Response, NextFunction } from 'express';
import {
  PostDeleteRequest,
  PostPostRequest,
  PostUpdateRequest,
  RequestIdParam,
  Post as PostType,
  PostArray as PostArrayType,
} from './post.types';
import { decodedToken as decodedTokenType } from '../login/login.types';
import { User as UserType } from '../user/user.types';
import Post from './post.model';
import User from '../user/user.model';

const getPostsController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = PostArrayType.check(await Post.findAll({ raw: true }));
    res.status(200).json(posts);
  } catch (error: unknown) {
    next(error);
  }
};

const getPostByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const post = PostType.check(await Post.findByPk(id));
    res.status(200).json(post);
  } catch (error: unknown) {
    next(error);
  }
};

const deletePostByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { decodedToken } = PostDeleteRequest.check(req.body);
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));
    const post = PostType.check(await Post.findByPk(id));

    if (user.id !== post.userId) {
      res
        .status(401)
        .json({ error: 'not authorized to delete this post' })
        .end();
    }

    await Post.destroy({
      where: {
        id,
      },
    });

    res.status(204).end();
  } catch (error: unknown) {
    next(error);
  }
};

const createPostController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      threadId,
      content,
      isOriginalPost,
      decodedToken,
    } = PostPostRequest.check(req.body);

    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));

    const newPost = await Post.create({
      userId: user.id,
      authorName: user.name ? user.name : user.username,
      threadId,
      isOriginalPost,
      content,
    });
    res.status(201).json(newPost).end();
  } catch (error) {
    next(error);
  }
};

const updatePostByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, decodedToken } = PostUpdateRequest.check(req.body);
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const token = decodedTokenType.check(decodedToken);
    const post = PostType.check(await Post.findByPk(id));

    if (token.id !== post.userId) {
      res.status(401).json({ error: 'not authorized to update this post' });
      return;
    }

    const results = await Post.update(
      { content },
      { where: { id }, returning: true },
    );
    const updatedPost = PostType.check(results[1][0]);
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export default {
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  createPostController,
  updatePostByIdController,
};
