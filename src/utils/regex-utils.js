import { portRegex } from 'config/regex-expressions';

export const getArrayOfRegexMatches = (string, regexExpression) => {
  const results = [];
  loopRegexMatches(string, regexExpression, res => results.push(res));
  return results;
};

export const loopRegexMatches = (string, regexExpression, callback) => {
  let match;
  while ((match = regexExpression.exec(string)) !== null) {
    callback(match);
  }
};

export const getRegexMatches = (str, regex) => {
  var matches = [];
  var match;

  if (regex.global) {
    regex.lastIndex = 0;
  } else {
    regex = new RegExp(
      regex.source,
      'g' + (regex.ignoreCase ? 'i' : '') + (regex.multiline ? 'm' : '') + (regex.sticky ? 'y' : '')
    );
  }

  while ((match = regex.exec(str))) {
    matches.push(match);

    if (regex.lastIndex === match.index) {
      regex.lastIndex++;
    }
  }

  return matches;
};

export const getRegexResults = (string, regex) => {
  const results = getRegexMatches(string, regex);
  if (results.length === 0) {
    return { result: false, matches: [] };
  }
  return { result: true, matches: results[0] };
};

export const getProblemPort = message => {
  let result = getRegexMatches(message, portRegex);
  return result.length === 0 ? false : result[0][2];
};
