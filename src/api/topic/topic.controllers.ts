import { Request, Response } from 'express';
import Thread from '../thread/thread.model';
import { ThreadArray } from '../thread/thread.types';
import Topic from './topic.model';
import {
  RtValidationError,
  Topic as TopicType,
  TopicArray as TopicArrayType,
  RequestIdParam,
} from './topic.types';

const getTopicsController = async (_req: Request, res: Response) => {
  try {
    const topics = TopicArrayType.check(await Topic.findAll());
    res.json(topics);
  } catch (error: unknown) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        res.status(400).json({ error: error.details });
        return;
      }
    }

    res.status(500);
  }
};

const getTopicByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const topic = TopicType.check(await Topic.findByPk(id));
    res.status(200).json(topic);
  } catch (error: unknown) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        res.status(400).json({ error: error.details });
        return;
      }
    }

    res.status(500);
  }
};

const getThreadsOfTopicController = async (req: Request, res: Response) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const threads = ThreadArray.check(
      await Thread.findAll({ raw: true, where: { topicId: id }, order: [['id', 'ASC']] }),
    );
    res.status(200).json(threads);
  } catch (error) {
    // console.error(error);
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        res.status(400).json({ error: error.details });
      } else {
        res.status(500);
      }
    } else {
      res.status(500);
    }
  }
};

export default {
  getTopicsController,
  getTopicByIdController,
  getThreadsOfTopicController,
};
