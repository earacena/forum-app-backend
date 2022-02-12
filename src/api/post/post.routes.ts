import express from 'express';
import postControllers from './post.controllers';
import mw from './post.middleware';

const {
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  createPostController,
  updatePostByIdController,
} = postControllers;

const postsRouter = express.Router();

postsRouter.get('/', getPostsController);
postsRouter.post('/', mw.authenticate, createPostController);
postsRouter.get('/:id', getPostByIdController);
postsRouter.delete('/:id', mw.authenticate, deletePostByIdController);
postsRouter.put('/:id', mw.authenticate, updatePostByIdController);

export default postsRouter;
