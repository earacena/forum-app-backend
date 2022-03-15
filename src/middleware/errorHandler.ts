import { ErrorRequestHandler } from 'express';
import {
  InstanceOf as RtInstanceOf,
  ValidationError as RtValidationError,
} from 'runtypes';

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError' && RtInstanceOf(RtValidationError).guard(err)) {
    if (err.details && 'decodedToken' in err.details) {
      res.status(401).json({ error: 'invalid or missing token' }).end();
    } else if (err.details && 'user' in err.details) {
      res.status(400).json({ error: 'user does not exist' }).end();
    } else if (err.code === 'TYPE_INCORRECT' && err.message.includes('dateRegistered') && err.message.includes('was null')) {
      // User was not found, User model is the only model with dateRegistered field
      res.status(400).json({ error: 'invalid credentials' }).end();
    } else if (err.code === 'TYPE_INCORRECT' && err.message.includes('isOriginalPost') && err.message.includes('was null')) {
      // Post was not found, Post model is the only model with isOriginalPost field
      res.status(400).json({ error: 'post with that id not found' }).end();
    } else if (err.code === 'TYPE_INCORRECT' && err.message.includes('topicId') && err.message.includes('was null')) {
      // Thread was not found, Thread model is the only model with topicId field
      res.status(400).json({ error: 'Thread with that id not found' }).end();
    } else if (err.code === 'TYPE_INCORRECT' && err.message.includes('description') && err.message.includes('was null')) {
      // Topics was not found, Topics model is the only model with description field
      res.status(400).json({ error: 'Thread with that id not found' }).end();
    } else if (err.details && err.code === 'CONTENT_INCORRECT') {
      res.status(500).json({ error: err.details }).end();
    }
  } else if (err.name === 'SequelizeValidationError') {
    res.status(400).json({ error: 'model validation failed' }).end();
  } else if (err.name === 'SequelizeConnectionRefusedError') {
    res.status(503).json({ error: 'database connnection error' }).end();
  } else if (err.name === 'JsonWebTokenError') {
    res.status(400).json({ error: 'malformed token' }).end();
  } else {
    res.status(500).end();
  }

  next(err);
};

export default errorHandler;
