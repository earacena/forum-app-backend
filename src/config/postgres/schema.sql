-- Setup schema
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT,
  name TEXT,
  date_registered TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  password_hash TEXT
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  thread_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  date_posted TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE threads (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL,
  date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL
);

-- -- Test data
-- Create test user(s)
-- Bcrypt hash used here for testing is generated using input "testpassword",
--  this hash is only used for creation of a test user for local development:
--  $2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW
INSERT INTO users(username, name, password_hash)
VALUES ('testuser', 'Test User', '$2b$10$PHEk/xaRipJTFbV76TW6X.RrZSc/xffBcuTfeKkPHNAgVeISBizsW');

-- Create test threads by user(s)
INSERT INTO threads(user_id, title)
SELECT id, 'This is my first thread!'
FROM users
WHERE username = 'testuser';

-- Create test posts by user(s)
INSERT INTO posts(thread_id, user_id, content)
SELECT id, user_id, 'This is my first post in this thread'
FROM threads
WHERE title = 'This is my first thread!';

-- Check if data was initialized properly
select * from users;
select * from posts;
select * from threads;