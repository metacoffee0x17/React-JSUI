import compact from 'lodash/compact';
import map from 'lodash/map';
import order from 'lodash/orderBy';
import { DEFAULT_FIELDS } from 'generators/field-types';

export const compactJoin = arr => compact(arr).join(' ');

export const getDefaultOrder = argz => {
  return [DEFAULT_FIELDS.NAME, DEFAULT_FIELDS.PATH, ...map(argz, a => a.key)];
};

export const processArguments = (argz, ARGUMENTS, asArray = false, argumentsOrder) => {
  const mappedArguments = map(ARGUMENTS, a => a);

  const orderedArguments = argumentsOrder
    ? order(mappedArguments, a => argumentsOrder.indexOf(a.key))
    : mappedArguments;

  const res = orderedArguments.map(argument => {
    let value = argz[argument.key];

    if (argument.onlyValue === true) {
      if (value) {
        return value;
      }
    } else if (argument.flag === true) {
      if (value === true) {
        return argument.key;
      }
    } else {
      if (value !== undefined && value !== null) {
        return `${argument.key} ${value}`;
      }
    }
  });

  return asArray ? compact(res) : compactJoin(res);
};
