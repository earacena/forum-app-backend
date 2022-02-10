import supertest from 'supertest';
import app from '../../app';
import { sequelize } from '../../utils/db';
import Thread from './thread.model';
import {
  Thread as ThreadType,
  ThreadArray as ThreadArrayType,
} from './thread.types';

const api = supertest(app.app);

describe('Thread API', () => {
  describe('when retrieving threads', () => {
    beforeEach(async () => {
      await Thread.sync({ force: true });
      await Thread.create({
        userId: 1,
        title: 'Discussion topic #1',
      });
      await Thread.create({
        userId: 2,
        title: 'Discussion topic #2',
      });
      await Thread.create({
        userId: 3,
        title: 'Discussion topic #3',
      });
    });

    test('successfully retrieves all threads', async () => {
      const response = await api.get('/api/threads').expect(200);
      const threads = ThreadArrayType.check(JSON.parse(response.text));
      expect(threads).toHaveLength(3);
    });

    test('successfully a thread by id', async () => {
      const response = await api.get('/api/threads/1').expect(200);
      const thread = ThreadType.check(JSON.parse(response.text));
      expect(thread).toBeDefined();
      expect(thread.title).toBe('Discussion topic #1');
    });
  });

  describe('when deleting threads', () => {
    beforeEach(async () => {
      await Thread.sync({ force: true });
      await Thread.create({
        userId: 1,
        title: 'Discussion topic #1',
      });
      await Thread.create({
        userId: 2,
        title: 'Discussion topic #2',
      });
      await Thread.create({
        userId: 3,
        title: 'Discussion topic #3',
      });
    });

    test('successfully deletes thread', async () => {
      const response = await api.get('/api/threads/').expect(200);
      const threads = ThreadArrayType.check(JSON.parse(response.text));
      const thread = ThreadType.check(threads[0]);
      await api.delete(`/api/threads/${thread.id}`).expect(204);
    });

    test('deletion is reflected in length of returned threads', async () => {
      let response = await api.get('/api/threads/').expect(200);
      let threads = ThreadArrayType.check(JSON.parse(response.text));
      const thread = ThreadType.check(threads[0]);
      await api.delete(`/api/threads/${thread.id}`).expect(204);

      response = await api.get('/api/threads').expect(200);
      threads = ThreadArrayType.check(JSON.parse(response.text));
      expect(JSON.parse(response.text)).toHaveLength(2);
    });
  });

  describe('when creating threads', () => {
    beforeEach(async () => {
      await Thread.sync({ force: true });
    });

    test('successfully creates thread', async () => {
      const newThread = {
        userId: 1,
        title: 'Interesting topic to discuss',
      };

      const response = await api
        .post('/api/threads')
        .send(newThread)
        .expect(201);

      const thread = ThreadType.check(JSON.parse(response.text));
      expect(thread).toBeDefined();
      expect(thread.title).toBe('Interesting topic to discuss');
      expect(thread.userId).toBe(1);
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
