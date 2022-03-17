import {
  Record as RtRecord,
  String as RtString,
  Number as RtNumber,
  InstanceOf as RtInstanceOf,
  ValidationError,
} from 'runtypes';

export const RequestIdParam = RtRecord({
  id: RtString,
});

export const decodedToken = RtRecord({
  id: RtNumber,
  username: RtString,
  role: RtString,
});

export const RtValidationError = RtInstanceOf(ValidationError);
