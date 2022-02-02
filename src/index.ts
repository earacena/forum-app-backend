import express from 'express';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import threadsRouter from './routes/threads';

const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/threads', threadsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
