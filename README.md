# forum-app-backend

## Description
This is backend of a forum web application.

### Technologies
  * Typescript
  * PostgreSQL
  * Expressjs
  * Nodejs

## Usage
### Download
While in terminal with chosen directory, enter the command:
```
git clone https://github.com/earacena/forum-app-backend.git
```

### Install
While in the root project folder, enter the command:
```
npm install
```

### Deploy locally for development
In one terminal, run the following in the root project folder:
```
docker-compose -f docker-compose.dev.yml up --build
```

In another terminal, run:
```
npm run dev
```