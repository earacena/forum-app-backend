import * as RT from 'runtypes';
import utils from './utils';

const { isDateString } = utils;

export const Post = RT.Record({
  id: RT.Number,
  threadId: RT.Number,
  userId: RT.Number,
  content: RT.String,
  datePosted: RT.String.withConstraint(isDateString),
});
export const PostArray = RT.Array(Post);

export const Thread = RT.Record({
  id: RT.Number,
  userId: RT.Number,
  dateCreated: RT.String.withConstraint(isDateString),
  title: RT.String,
});
export const ThreadArray = RT.Array(Thread);

export type Posts = RT.Static<typeof PostArray>;
export type Threads = RT.Static<typeof ThreadArray>;

export const PostRequest = RT.Record({
  userId: RT.Number,
  threadId: RT.Number,
  content: RT.String,
});

export const PostUpdateRequest = RT.Record({
  content: RT.String,
});

export const ThreadRequest = RT.Record({
  userId: RT.Number,
  title: RT.String,
});

export const UserRequest = RT.Record({
  name: RT.String,
  username: RT.String,
});
