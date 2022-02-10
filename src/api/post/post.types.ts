import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
} from 'runtypes';

export const Post = RtRecord({
  id: RtNumber,
  threadId: RtNumber,
  userId: RtNumber,
  content: RtString,
  datePosted: RtString.withConstraint((x: string) => {
    // Must be parsable into a Date object
    if (!x || x === null || typeof x !== 'string' || Number.isNaN(Date.parse(x))) {
      return false;
    }

    return true;
  }),
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
