import {
  Record as RtRecord,
  Number as RtNumber,
  String as RtString,
  Array as RtArray,
  Static as RtStatic,
} from 'runtypes';

export const Role = RtRecord({
  id: RtNumber,
  userId: RtNumber,
  forumId: RtNumber,
  role: RtString,
});

export const RoleArray = RtArray(Role);

export type Roles = RtStatic<typeof RoleArray>;
