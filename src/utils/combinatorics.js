import reduce from 'lodash/reduce';
import flatten from 'lodash/flatten';
import concat from 'lodash/concat';
import zipObject from 'lodash/zipObject';
import every from 'lodash/every';
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import toArray from 'lodash/toArray';
import values from 'lodash/values';
import keys from 'lodash/values';

function _cartesianProductOf(args) {
  if (arguments.length > 1) args = toArray(arguments);

  args = map(args, opt => (typeof opt === 'string' ? toArray(opt) : opt));

  return reduce(
    args,
    function(a, b) {
      return flatten(
        map(a, function(x) {
          return map(b, function(y) {
            return concat(x, [y]);
          });
        }),
        true
      );
    },
    [[]]
  );
}

function _cartesianProductObj(optObj) {
  let keys = keys(optObj);
  let opts = values(optObj);
  let combs = _cartesianProductOf(opts);
  return map(combs, function(comb) {
    return zipObject(keys, comb);
  });
}

export function product(opts) {
  if (arguments.length === 1 && !isArray(opts)) return _cartesianProductObj(opts);
  else if (arguments.length === 1) return _cartesianProductOf(opts);
  else return _cartesianProductOf(arguments);
}

function permutations(obj, n) {
  if (typeof obj == 'string') obj = toArray(obj);
  n = n ? n : obj.length;
  // make n copies of keys/indices
  const nInds = []; //TODO: WHAT

  for (let j = 0, nInds = []; j < n; j++) {
    nInds.push(keys(obj));
  }
  // get product of the indices, then filter to remove the same key twice
  let arrangements = product(nInds).filter(pair => pair[0] !== pair[1]);
  return map(arrangements, indices => map(indices, i => obj[i]));
}

function combinations(obj, n) {
  /* filter out keys out of order, e.g. [0,1] is ok but [1,0] isn't */
  function isSorted(arr) {
    return every(arr, function(value, index, array) {
      return index === 0 || String(array[index - 1]) <= String(value);
    });
  }
  // array with n copies of the keys of obj
  return permutations(keys(obj), n)
    .filter(isSorted)
    .map(indices => map(indices, i => obj[i]))
    .value();
}

function combinations_with_replacement(obj, n) {
  if (typeof obj == 'string') obj = toArray(obj);
  n = n ? n : obj.length;
  // make n copies of keys/indices
  for (let j = 0, nInds = []; j < n; j++) {
    nInds.push(keys(obj));
  }
  const nInds = []; //TODO: WHAT
  // get product of the indices, then filter to keep elements in order
  let arrangements = product(nInds).filter(pair => pair[0] <= pair[1]);
  return map(arrangements, indices => map(indices, i => obj[i]));
}
