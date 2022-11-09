-- Setup schema
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT,
  name TEXT,
  password_hash TEXT,
  date_registered TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  thread_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  author_name TEXT NOT NULL,
  is_original_post BOOLEAN NOT NULL,
  content TEXT NOT NULL,
  date_posted TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE threads (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL,
  forum_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE forums (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL,
  forum_id INTEGER NOT NULL,
  role TEXT NOT NULL
);

-- -- Test data
-- Create test user(s)
-- Bcrypt hash used here for testing is generated using input "testpassword",
--  this hash is only used for creation of a test user for local development:
--  $2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW
INSERT INTO users(username, name, password_hash)
VALUES ('testuser', 'Test User', '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW');

-- Create test forum
INSERT INTO forums (user_id, title)
VALUES (1, 'First Forum');

-- Create test topics
INSERT INTO topics (user_id, forum_id, title, description)
VALUES (1, 1, 'Technology', 'Discussions about technology.');

-- Create test threads by user(s)
INSERT INTO threads(user_id, topic_id, title)
SELECT id, 1, 'This is my first thread!'
FROM users
WHERE username = 'testuser';

-- Create test posts by user(s)
INSERT INTO posts(thread_id, user_id, is_original_post, content, author_name)
SELECT id, user_id, true, 'This is my first post in this thread', 'Test User'
FROM threads
WHERE title = 'This is my first thread!';

-- Create role for user
INSERT INTO roles(user_id, forum_id, role) VALUES (1, 1, 'admin');

-- Check if data was initialized properly
select * from users;
select * from posts;
select * from threads;
select * from topics;
select * from forums;