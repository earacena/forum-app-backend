import { Record as RtRecord, String as RtString } from 'runtypes';

export const Role = RtRecord({
  userId: RtString,
  role: RtString,
});

export default {
  Role,
};
