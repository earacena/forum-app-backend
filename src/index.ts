import express from 'express';

const app = express();

app.use(express.json());

const PORT = 3000;

app.get('/test', (_request, response) => {
  console.log('GET @ /test');
  response.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
