import { String as RtString, Record as RtRecord } from 'runtypes';

const LoginRequest = RtRecord({
  username: RtString,
  password: RtString,
});

export default LoginRequest;
