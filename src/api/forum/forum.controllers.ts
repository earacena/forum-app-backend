import { NextFunction, Request, Response } from 'express';

const createForumController = (_req: Request, res: Response, next: NextFunction) => res.status(200);

export default {
  createForumController,
};
