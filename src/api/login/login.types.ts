import {
  String as RtString,
  Record as RtRecord,
  Number as RtNumber,
} from 'runtypes';

export const LoginRequest = RtRecord({
  username: RtString,
  password: RtString,
});

export const decodedToken = RtRecord({
  id: RtNumber,
  username: RtString,
});

export const PasswordHash = RtString;
export const TokenResponse = RtRecord({
  token: RtString,
  id: RtNumber,
  username: RtString,
  name: RtString,
});
