import { portRegex } from 'config/regex-expressions';

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

export const getProblemPort = message => {
  let result = getRegexMatches(message, portRegex);
  return result.length === 0 ? false : result[0][2];
};
