import supertest from 'supertest';
import app from '../../app';
import User from './user.model';
import Role from '../role/role.model';
import { User as UserType, UserArray as UserArrayType } from './user.types';

jest.mock('./user.model');
jest.mock('../role/role.model');

const api = supertest(app.app);

describe('User API', () => {
  const mockedUsers = [
    {
      id: 1,
      name: 'Mocked User 1',
      username: 'mockuser1',
      // bcrypt hash for password 'testpassword'
      passwordHash:
        '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
      dateRegistered: new Date(Date.now()).toDateString(),
    },
    {
      id: 2,
      name: 'Mocked User 2',
      username: 'mockuser2',
      // bcrypt hash for password 'testpassword'
      passwordHash:
        '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
      dateRegistered: new Date(Date.now()).toDateString(),
    },
    {
      id: 3,
      name: 'Mocked User 3',
      username: 'mockuser3',
      // bcrypt hash for password 'testpassword'
      passwordHash:
        '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
      dateRegistered: new Date(Date.now()).toDateString(),
    },
  ];

  beforeAll(() => {
    (User.findByPk as jest.Mock).mockResolvedValue(mockedUsers[0]);
    (User.findAll as jest.Mock).mockResolvedValue(mockedUsers);
    (User.create as jest.Mock).mockResolvedValue({
      id: 4,
      name: 'Mocked User 4',
      username: 'mockuser4',
      passwordHash:
        '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW',
      dateRegistered: new Date(Date.now()).toDateString(),
    });
    (User.destroy as jest.Mock).mockImplementation(() => {});
    (Role.create as jest.Mock).mockResolvedValue({
      userId: 1,
      role: 'admin',
    });
  });

  describe('when retrieving users', () => {
    test('successfully retrieves all users', async () => {
      const response = await api.get('/api/users').expect(200);
      const users = UserArrayType.check(JSON.parse(response.text));
      expect(users).toHaveLength(3);
    });

    test('successfully a user by id', async () => {
      const response = await api.get('/api/users/1').expect(200);
      const user = UserType.check(JSON.parse(response.text));
      expect(user).toBeDefined();
      expect(user.username).toBe('mockuser1');
    });
  });

  describe('when deleting users', () => {
    test('successfully deletes user', async () => {
      const response = await api.get('/api/users/').expect(200);
      const users = UserArrayType.check(JSON.parse(response.text));
      const user = UserType.check(users[0]);
      await api.delete(`/api/users/${user.id}`).expect(204);
    });

    test('deletion is reflected in length of returned users', async () => {
      let response = await api.get('/api/users/').expect(200);
      let users = UserArrayType.check(JSON.parse(response.text));
      const user = UserType.check(users[0]);
      await api.delete(`/api/users/${user.id}`).expect(204);

      (User.findAll as jest.Mock).mockResolvedValueOnce(mockedUsers.slice(1));

      response = await api.get('/api/users').expect(200);
      users = UserArrayType.check(JSON.parse(response.text));
      expect(users).toHaveLength(2);
    });
  });

  describe('when creating users', () => {
    test('successfully creates user', async () => {
      const newUser = {
        name: 'Mock User 4',
        username: 'mockuser4',
        password: 'testpassword',
      };

      const response = await api.post('/api/users').send(newUser).expect(201);

      const user = UserType.check(JSON.parse(response.text));

      expect(user).toBeDefined();
      expect(user.username).toBe('mockuser4');
      expect(user.name).toBe('Mocked User 4');
      expect(user.id).toBe(4);
      expect(user.passwordHash).toBeDefined();
    });
  });
});
