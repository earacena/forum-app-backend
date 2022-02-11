import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  Optional as RtOptional,
  InstanceOf as RtInstanceOf,
  ValidationError,
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
export const RequestIdParam = RtString;

export const RtValidationError = RtInstanceOf(ValidationError);
