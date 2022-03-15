import { Record as RtRecord, Number as RtNumber, String as RtString } from 'runtypes';

export const Role = RtRecord({
  userId: RtNumber,
  role: RtString,
});

export default {
  Role,
};
