import express from 'express';
import postControllers from './post.controllers';

const { getPostsController, getPostByIdController, deletePostByIdController, createPostController } = postControllers;

const postsRouter = express.Router();

postsRouter.get('/', getPostsController);
postsRouter.post('/', createPostController);
postsRouter.get('/:id', getPostByIdController);
postsRouter.delete('/:id', deletePostByIdController);

export default postsRouter;
