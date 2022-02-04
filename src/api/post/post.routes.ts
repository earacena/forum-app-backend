import express from 'express';
import postControllers from './post.controllers';

const { getPostsController } = postControllers;

const postsRouter = express.Router();

postsRouter.get('/', getPostsController);

export default postsRouter;
