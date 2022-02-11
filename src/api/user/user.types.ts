import {
  Number as RtNumber,
  String as RtString,
  Record as RtRecord,
  Static as RtStatic,
  Array as RtArray,
  InstanceOf as RtInstanceOf,
} from 'runtypes';

export const User = RtRecord({
  id: RtNumber,
  name: RtString,
  username: RtString,
  passwordHash: RtString,
  dateRegistered: RtInstanceOf(Date),
});

export const UserPostRequest = RtRecord({
  name: RtString,
  username: RtString,
  password: RtString,
});

export const UserArray = RtArray(User);
export type Users = RtStatic<typeof UserArray>;
