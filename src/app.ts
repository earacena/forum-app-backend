import express from 'express';
import helmet from 'helmet';
import usersRouter from './api/user/user.routes';
import postsRouter from './api/post/post.routes';
import threadsRouter from './api/thread/thread.routes';
import { PORT } from './config';
import { connectToDatabase } from './utils/db';

const app = express();

// Pre-route middleware
app.use(express.json());
app.use(helmet());

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

export default { main };
