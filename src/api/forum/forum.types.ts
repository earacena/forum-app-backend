import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  InstanceOf as RtInstanceOf,
  Union as RtUnion,
} from 'runtypes';

export const Forum = RtRecord({
  id: RtNumber,
  userId: RtNumber,
  title: RtString,
  dateCreated: RtUnion(
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

export const ForumArray = RtArray(Forum);

export type Forums = RtStatic<typeof ForumArray>;
