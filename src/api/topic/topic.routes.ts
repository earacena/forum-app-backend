import express from 'express';
import topicControllers from './topic.controllers';

const {
  getTopicsController,
  getTopicByIdController,
  getThreadsOfTopicController,
} = topicControllers;

const topicsRouter = express.Router();

topicsRouter.get('/', getTopicsController);
topicsRouter.get('/:id', getTopicByIdController);
topicsRouter.get('/:id/threads', getThreadsOfTopicController);

export default topicsRouter;
