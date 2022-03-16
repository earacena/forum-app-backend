import {
  Record as RtRecord,
  Number as RtNumber,
  String as RtString,
  Union as RtUnion,
  InstanceOf as RtInstanceOf,
  Array as RtArray,
  Optional as RtOptional,
  ValidationError,
} from 'runtypes';

export const Topic = RtRecord({
  id: RtNumber,
  userId: RtNumber,
  title: RtString,
  description: RtString,
  dateCreated: RtUnion(
    RtInstanceOf(Date),
    RtString.withConstraint((x: string) => {
      // Must be parsable into  date string
      if (!x
        || x === null
        || typeof x !== 'string'
        || Number.isNaN(Date.parse(x))
      ) {
        return false;
      }

      return true;
    }),
  ),
});

export const RequestIdParam = RtRecord({
  id: RtString,
});

export const decodedToken = RtRecord({
  id: RtNumber,
  username: RtString,
  role: RtString,
});

export const TopicPostRequest = RtRecord({
  title: RtString,
  description: RtString,
  decodedToken: RtOptional(
    RtRecord({
      id: RtNumber,
      username: RtString,
    }),
  ),
});

export const TopicArray = RtArray(Topic);
export const RtValidationError = RtInstanceOf(ValidationError);
