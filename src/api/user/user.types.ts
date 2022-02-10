import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
} from 'runtypes';

export const User = RtRecord({
  id: RtNumber,
  name: RtString,
  username: RtString,
  passwordHash: RtString,
  dateRegistered: RtString.withConstraint((x: string) => {
    // Must be parsable to a Date object if needed
    if (!x || x === null || typeof x !== 'string' || Number.isNaN(Date.parse(x))) {
      return false;
    }

    return true;
  }),
});

export const UserPostRequest = RtRecord({
  name: RtString,
  username: RtString,
  password: RtString,
});

export const UserArray = RtArray(User);
export type Users = RtStatic<typeof UserArray>;
