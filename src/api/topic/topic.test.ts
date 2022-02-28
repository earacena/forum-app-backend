import supertest from 'supertest';
import app from '../../app';
import Topic from './topic.model';
import 'sequelize';
import {
  Topic as TopicType,
  TopicArray as TopicArrayType,
} from './topic.types';

const api = supertest(app.app);

jest.mock('sequelize');
jest.mock('./topic.model');

describe('Topic API', () => {
  const mockedTopics = [
    {
      id: 1,
      userId: 1,
      title: 'Cars',
      description: 'Anything and everything about cars.',
      dateCreated: new Date(Date.now()).toDateString(),
    },
    {
      id: 2,
      userId: 2,
      title: 'Food',
      description: 'Share your favorite food recipes.',
      dateCreated: new Date(Date.now()).toDateString(),
    },
    {
      id: 3,
      userId: 3,
      title: 'Music',
      description: 'Discussions about music.',
      dateCreated: new Date(Date.now()).toDateString(),
    },
  ];

  beforeAll(() => {
    (Topic.findAll as jest.Mock).mockResolvedValue(mockedTopics);
    (Topic.findByPk as jest.Mock).mockResolvedValue(mockedTopics[1]);
  });

  describe('when retrieving topics', () => {
    test('successfully retrieves all topics', async () => {
      const response = await api.get('/api/topics').expect(200);
      const topics = TopicArrayType.check(JSON.parse(response.text));
      expect(topics).toHaveLength(3);
    });

    test('retrieves a topic by id', async () => {
      const response = await api.get('/api/topics/2').expect(200);
      const topic = TopicType.check(JSON.parse(response.text));
      expect(topic).toBeDefined();
    });
  });
});
