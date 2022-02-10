import { Request, Response } from 'express';
import { PostRequest, PostUpdateRequest } from '../../types';
import Post from './post.model';

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
  await Post.destroy({
    where: {
      id: req.params['id'],
    },
  });
  res.status(204).end();
};

const createPostController = async (req: Request, res: Response) => {
  const { userId, threadId, content } = PostRequest.check(req.body);
  const newPost = await Post.create({
    userId,
    threadId,
    content,
  });
  res.status(201).json(newPost);
};

const updatePostByIdController = async (req: Request, res: Response) => {
  const { content } = PostUpdateRequest.check(req.body);
  await Post.update(
    {
      content,
    },
    {
      where: {
        id: req.params['id'],
      },
    },
  );

  const updatedPost = await Post.findByPk(req.params['id']);
  res.status(200).json(updatedPost);
};

export default {
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  createPostController,
  updatePostByIdController,
};
