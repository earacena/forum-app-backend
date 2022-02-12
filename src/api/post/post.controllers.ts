import { Request, Response } from 'express';
import { RtValidationError, PostDeleteRequest, PostPostRequest, PostUpdateRequest, RequestIdParam, Post as PostType } from './post.types';
import { decodedToken as decodedTokenType } from '../login/login.types';
import { User as UserType } from '../user/user.types';
import Post from './post.model';
import User from '../user/user.model';

const getPostsController = async (_req: Request, res: Response) => {
  const posts = await Post.findAll();
  res.status(200).json(posts);
};

const getPostByIdController = async (req: Request, res: Response) => {
  const post = await Post.findByPk(req.params['id']);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).end();
  }
};

const deletePostByIdController = async (req: Request, res: Response) => {
  try {
    const { decodedToken } = PostDeleteRequest.check(req.body);
    const postId = RequestIdParam.check({ id: req.params['id'] });
    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));
    const post = PostType.check(await Post.findByPk(postId));

    if (user.id !== post.userId) {
      res.status(401).json({ error: 'not authorized to delete this post' }).end();
    }

    await Post.destroy({
      where: {
        postId,
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

const createPostController = async (req: Request, res: Response) => {
  try {
    const {
      threadId,
      content,
      decodedToken,
    } = PostPostRequest.check(req.body);

    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));

    const newPost = await Post.create({
      userId: user.id,
      threadId,
      content,
    });
    res
      .status(201)
      .json(newPost)
      .end();
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

const updatePostByIdController = async (req: Request, res: Response) => {
  try {
    const { content, decodedToken } = PostUpdateRequest.check(req.body);
    const postId = RequestIdParam.check({ id: req.params['id'] });
    const token = decodedTokenType.check(decodedToken);
    const post = PostType.check(await Post.findByPk(postId));

    if (token.id !== post.userId) {
      res.status(401).json({ error: 'not authorized to update this post' }).end();
    }

    await Post.update(
      {
        content,
      },
      {
        where: {
          id: postId,
        },
      },
    );

    const updatedPost = await Post.findByPk(postId);
    res.status(200).json(updatedPost);
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

export default {
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  createPostController,
  updatePostByIdController,
};
