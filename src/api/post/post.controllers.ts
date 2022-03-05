import { Request, Response, NextFunction } from 'express';
import {
  RtValidationError,
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

const getPostsController = async (_req: Request, res: Response) => {
  try {
    const posts = PostArrayType.check(await Post.findAll({ raw: true }));
    res.status(200).json(posts);
  } catch (error: unknown) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        res.status(500);
      } else {
        res.status(500);
        return;
      }
    }
    res.status(404);
  }
};

const getPostByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const post = PostType.check(await Post.findByPk(id));
    res.status(200).json(post);
  } catch (error: unknown) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        res.status(400).json({ error: error.details });
        return;
      }
    }
    res.status(400).json({ error: 'invalid request' });
  }
};

const deletePostByIdController = async (
  req: Request,
  res: Response,
  _next: NextFunction,
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
    // console.error(error);
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' });
        } else {
          res.status(400).json({ error: error.details });
          return;
        }
      }
    }

    res.status(400).json({ error: 'invalid request' });
  }
};

const createPostController = async (req: Request, res: Response) => {
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
    // console.error(error);
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' });
        } else {
          res.status(400).json({ error: error.details });
          return;
        }
      }
    }

    res.status(400).json({ error: 'invalid request' });
  }
};

const updatePostByIdController = async (req: Request, res: Response) => {
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
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' });
        } else {
          res.status(400).json({ error: error.details });
          return;
        }
      }
    }

    res.status(400).json({ error: 'invalid request' });
  }
};

export default {
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  createPostController,
  updatePostByIdController,
};
