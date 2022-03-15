import express from 'express';
import auth from '../../middleware/authenticate';
import topicControllers from './topic.controllers';

const {
  getTopicsController,
  getTopicByIdController,
  getThreadsOfTopicController,
  createTopicController,
} = topicControllers;

const topicsRouter = express.Router();

topicsRouter.get('/', getTopicsController);
topicsRouter.get('/:id', getTopicByIdController);
topicsRouter.get('/:id/threads', getThreadsOfTopicController);
topicsRouter.post('/', auth, createTopicController);

export default topicsRouter;
