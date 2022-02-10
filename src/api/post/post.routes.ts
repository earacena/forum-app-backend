import express from 'express';
import postControllers from './post.controllers';

const {
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  createPostController,
  updatePostByIdController,
} = postControllers;

const postsRouter = express.Router();

postsRouter.get('/', getPostsController);
postsRouter.post('/', createPostController);
postsRouter.get('/:id', getPostByIdController);
postsRouter.delete('/:id', deletePostByIdController);
postsRouter.put('/:id', updatePostByIdController);

export default postsRouter;
