import { ErrorRequestHandler } from 'express';
import { InstanceOf as RtInstanceOf, ValidationError as RtValidationError } from 'runtypes';

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError' && RtInstanceOf(RtValidationError).guard(err)) {
    if (err.details && 'decodedToken' in err.details) {
      res.status(401).json({ error: 'invalid or missing token' }).end();
    } else if (err.details && 'user' in err.details) {
      res.status(400).json({ error: 'user does not exist' }).end();
    } else if (err.details && err.code === 'CONTENT_INCORRECT') {
      res.status(500).json({ error: err.details }).end();
    }
  } else if (err.name === 'SequelizeValidationError') {
    res.status(400).json({ error: 'model validation failed' }).end();
  } else if (err.name === 'SequelizeConnectionRefusedError') {
    res.status(503).json({ error: 'database connnection error' }).end();
  } else {
    res.status(500).end();
  }

  next(err);
};

export default errorHandler;