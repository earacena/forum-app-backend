import { Request, Response } from 'express';
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

export default {
  getPostsController,
  getPostByIdController,
};
