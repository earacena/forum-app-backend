import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  InstanceOf as RtInstanceOf,
} from 'runtypes';

export const Post = RtRecord({
  id: RtNumber,
  threadId: RtNumber,
  userId: RtNumber,
  content: RtString,
  datePosted: RtInstanceOf(Date),
});

export const PostArray = RtArray(Post);

export type Posts = RtStatic<typeof PostArray>;

export const PostPostRequest = RtRecord({
  userId: RtNumber,
  threadId: RtNumber,
  content: RtString,
});

export const PostUpdateRequest = RtRecord({
  content: RtString,
});
