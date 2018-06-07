import { mapObject } from 'utils';

export const optionsFromEnum = enumObject =>
  mapObject(
    enumObject,
    (key, value) =>
      console.log('key', key) || {
        [value]: key
      }
  );
