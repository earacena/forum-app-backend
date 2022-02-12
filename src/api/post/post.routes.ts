import express from 'express';
import postControllers from './post.controllers';
import auth from '../../middleware/authenticate';

const {
  getPostsController,
  getPostByIdController,
  deletePostByIdController,
  createPostController,
  updatePostByIdController,
} = postControllers;

const postsRouter = express.Router();

postsRouter.get('/', getPostsController);
postsRouter.post('/', auth, createPostController);
postsRouter.get('/:id', getPostByIdController);
postsRouter.delete('/:id', auth, deletePostByIdController);
postsRouter.put('/:id', auth, updatePostByIdController);

export default postsRouter;
