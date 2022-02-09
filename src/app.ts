import express from 'express';
import helmet from 'helmet';
import cors = require('cors');
import morgan = require('morgan');
import usersRouter from './api/user/user.routes';
import postsRouter from './api/post/post.routes';
import threadsRouter from './api/thread/thread.routes';
import { NODE_ENV, PORT } from './config';
import { connectToDatabase } from './utils/db';

const app = express();

// Pre-route middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/threads', threadsRouter);

const main = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server @ port ${PORT}`);
  });
};

export default { main, app };
