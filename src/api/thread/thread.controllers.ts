import { Request, Response } from 'express';
import { ThreadPostRequest } from './thread.types';
import Thread from './thread.model';

const getThreadsController = async (_req: Request, res: Response) => {
  const threads = await Thread.findAll();
  res.json(threads);
};

const createThreadController = async (req: Request, res: Response) => {
  const { title, userId } = ThreadPostRequest.check(req.body);
  const newThread = await Thread.create({
    title,
    userId,
  });
  res.status(201).json(newThread);
};

const getThreadByIdController = async (req: Request, res: Response) => {
  const thread = await Thread.findByPk(req.params['id']);
  if (thread) {
    res.status(200).json(thread);
  } else {
    res.status(404).end();
  }
};

const deleteThreadByIdController = async (req: Request, res: Response) => {
  await Thread.destroy({
    where: {
      id: req.params['id'],
    },
  });

  res.status(204).end();
};

export default {
  getThreadsController,
  getThreadByIdController,
  createThreadController,
  deleteThreadByIdController,
};
