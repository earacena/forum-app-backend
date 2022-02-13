import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  InstanceOf as RtInstanceOf,
  Union as RtUnion,
  ValidationError,
} from 'runtypes';

export const Thread = RtRecord({
  id: RtNumber,
  userId: RtNumber,
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
  userId: RtNumber,
  title: RtString,
});

export const RtValidationError = RtInstanceOf(ValidationError);
