import {
  Number as RtNumber,
  String as RtString,
  Array as RtArray,
  Static as RtStatic,
  Record as RtRecord,
} from 'runtypes';

import utils from './utils';

const { isDateString } = utils;

export const Post = RtRecord({
  id: RtNumber,
  threadId: RtNumber,
  userId: RtNumber,
  content: RtString,
  datePosted: RtString.withConstraint(isDateString),
});
export const PostArray = RtArray(Post);

export const Thread = RtRecord({
  id: RtNumber,
  userId: RtNumber,
  dateCreated: RtString.withConstraint(isDateString),
  title: RtString,
});
export const ThreadArray = RtArray(Thread);

export type Posts = RtStatic<typeof PostArray>;
export type Threads = RtStatic<typeof ThreadArray>;

export const PostPostRequest = RtRecord({
  userId: RtNumber,
  threadId: RtNumber,
  content: RtString,
});

export const PostUpdateRequest = RtRecord({
  content: RtString,
});

export const ThreadPostRequest = RtRecord({
  userId: RtNumber,
  title: RtString,
});

export const UserPostRequest = RtRecord({
  name: RtString,
  username: RtString,
});
