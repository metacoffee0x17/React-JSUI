import map from 'lodash/map';

const createVariant = (arr, { inverseName = false } = {}) =>
  map(arr, (value, key) => ({
    name: inverseName ? value : key,
    prop: value
  }));

const enumVariant = arr => createVariant(arr, { inverseName: true });

const booleanVariant = ([t = 'true', f = 'false'] = []) =>
  createVariant({
    [t]: true,
    [f]: false
  });

const stringVariant = strings => createVariant(strings, { inverseName: true });

export default {
  fromEnum: enumVariant,
  boolean: booleanVariant,
  string: stringVariant,
  create: createVariant
};
