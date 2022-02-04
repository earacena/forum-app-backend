import { Request, Response } from 'express';
import Post from './post.model';

const getPostsController = async (_req: Request, res: Response): Promise<Response> => {
  const posts = await Post.findAll();
  return res.status(200).json(posts);
};

export default {
  getPostsController,
};
