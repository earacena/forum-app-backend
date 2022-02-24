import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  Optional as RtOptional,
  InstanceOf as RtInstanceOf,
  ValidationError,
  Union as RtUnion,
} from 'runtypes';

export const Post = RtRecord({
  id: RtNumber,
  threadId: RtNumber,
  userId: RtNumber,
  authorName: RtString,
  content: RtString,
  datePosted: RtUnion(
    RtInstanceOf(Date),
    RtString.withConstraint((x: string) => {
      // Must be parsable into a Date object
      if (!x || x === null || typeof x !== 'string' || Number.isNaN(Date.parse(x))) {
        return false;
      }
      return true;
    }),
  ),
});

export const PostArray = RtArray(Post);

export type Posts = RtStatic<typeof PostArray>;

export const PostPostRequest = RtRecord({
  threadId: RtNumber,
  content: RtString,
  decodedToken: RtOptional(
    RtRecord({
      username: RtString,
      id: RtNumber,
    }),
  ),
});

export const PostUpdateRequest = RtRecord({
  content: RtString,
  decodedToken: RtOptional(
    RtRecord({
      username: RtString,
      id: RtNumber,
    }),
  ),
});

export const PostDeleteRequest = RtRecord({
  decodedToken: RtOptional(
    RtRecord({
      username: RtString,
      id: RtNumber,
    }),
  ),
});

export const RequestIdParam = RtRecord({
  id: RtString,
});

export const RtValidationError = RtInstanceOf(ValidationError);
