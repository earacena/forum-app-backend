import express from 'express';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import threadsRouter from './routes/threads';

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/threads', threadsRouter);


export default app;