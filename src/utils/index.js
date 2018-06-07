import map from 'lodash/map';

export const mapArray = (array, fn) =>
  array.reduce((accum, a) => {
    accum[a] = fn(a);
    return accum;
  }, {});

export const mapObject = (object, fn) => {
  const result = {};
  map(object, (value, key) => {
    result[key] = fn(value, key);
  });
  return result;
};

export const cycleValueAround = (current, change, max) => {
  current = current + change;
  if (current >= max) {
    current = 0;
  } else if (current === -1) {
    current = max - 1;
  }
  return current;
};
