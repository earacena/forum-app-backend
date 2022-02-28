import { Request, Response } from 'express';
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

export default {
  getTopicsController,
  getTopicByIdController,
};
