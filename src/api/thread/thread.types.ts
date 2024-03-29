import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  InstanceOf as RtInstanceOf,
  Union as RtUnion,
  Optional as RtOptional,
} from 'runtypes';

export const Thread = RtRecord({
  id: RtNumber,
  userId: RtNumber,
  topicId: RtNumber,
  title: RtString,
  dateCreated: RtUnion(
    RtInstanceOf(Date),
    RtString.withConstraint((x: string) => {
      // Must be parsable into  date string
      if (!x || x === null || typeof x !== 'string' || Number.isNaN(Date.parse(x))) {
        return false;
      }

      return true;
    }),
  ),
});

export const ThreadArray = RtArray(Thread);

export type Threads = RtStatic<typeof ThreadArray>;

export const ThreadPostRequest = RtRecord({
  title: RtString,
  topicId: RtNumber,
  decodedToken: RtOptional(
    RtRecord({
      id: RtNumber,
      username: RtString,
    }),
  ),
});

export const ThreadDeleteRequest = RtRecord({
  decodedToken: RtOptional(
    RtRecord({
      id: RtNumber,
      username: RtString,
    }),
  ),
});
