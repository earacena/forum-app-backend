import express from 'express';
import forumControllers from './forum.controllers';
import auth from '../../middleware/authenticate';

const {
  createForumController,
} = forumControllers;

const forumRouter = express.Router();

forumRouter.post('/', auth, createForumController);

export default forumRouter;
