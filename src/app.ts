import express from 'express';
import usersRouter from './api/user/user.routes';
import postsRouter from './api/post/post.routes';
import threadsRouter from './api/thread/thread.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/threads', threadsRouter);


export default app;