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
