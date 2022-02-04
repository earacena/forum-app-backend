import express from 'express';
import postControllers from './post.controllers';

const { getPostsController, getPostByIdController } = postControllers;

const postsRouter = express.Router();

postsRouter.get('/', getPostsController);
postsRouter.get('/:id', getPostByIdController);

export default postsRouter;
