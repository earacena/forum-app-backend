import {
  Record as RtRecord,
  String as RtString,
  Number as RtNumber,
  InstanceOf as RtInstanceOf,
  ValidationError,
} from 'runtypes';
import { RoleArray } from './api/role/role.types';

export const RequestIdParam = RtRecord({
  id: RtString,
});

export const decodedToken = RtRecord({
  id: RtNumber,
  username: RtString,
  roles: RoleArray,
});

export const RtValidationError = RtInstanceOf(ValidationError);
