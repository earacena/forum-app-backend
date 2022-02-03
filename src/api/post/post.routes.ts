
import express from 'express';
import { getPostsController } from './post.controllers';

const postsRouter = express.Router();

postsRouter.get('/', getPostsController);

export default postsRouter;