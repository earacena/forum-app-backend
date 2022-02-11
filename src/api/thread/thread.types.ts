import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  InstanceOf as RtInstanceOf,
} from 'runtypes';

export const Thread = RtRecord({
  id: RtNumber,
  userId: RtNumber,
  title: RtString,
  dateCreated: RtInstanceOf(Date),
});

export const ThreadArray = RtArray(Thread);

export type Threads = RtStatic<typeof ThreadArray>;

export const ThreadPostRequest = RtRecord({
  userId: RtNumber,
  title: RtString,
});
