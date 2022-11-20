# Forum Web Application, Backend

## Description

This is the backend of a forum web application. Deployed live [here](https://forum-app-frontend.onrender.com/).

The frontend repository can be accessed [here](https://github.com/earacena/forum-app-frontend).

### Routes

* /api/login
* /api/forums
* /api/topics
* /api/threads
* /api/posts
* /api/users
* /api/role

### Technologies

* Typescript
* PostgreSQL
* Expressjs
* Nodejs

## Usage

### Download

While in terminal with chosen directory, enter the command:

```bash
git clone https://github.com/earacena/forum-app-backend.git
```

### Install

While in the root project folder, enter the command:

```bash
npm install
```

### Setup

In order to run the backend, deploy locally, or run tests, a .env file with the following variables must be in root project folder:

```text
DEV_DATABASE_URL="postgres://pguser:pgpass@localhost:3003/pgdb"
TEST_DATABASE_URL="postgres://pguser:pgpass@localhost:3003/test_pgdb"
DATABASE_URL="postgres://..." # For live deployment, add connection URL for database 
PORT=3001
SECRET_JWT_KEY="abcd1234" # Generate your own key and paste here
```

### Deploy locally for development

In one terminal, run the following in the root project folder:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

In another terminal, run:

```bash
npm run dev
```
