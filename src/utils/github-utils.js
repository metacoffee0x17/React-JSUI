import { githubCloneRegex } from 'config/regex-expressions';
import { getRegexMatches } from 'utils/regex-utils';

export const isValidRepoUrl = (url = '') => githubCloneRegex.test(url);

export const isSpecificFolder = (url = '') => {
  const result = getRegexMatches(url, githubCloneRegex);
  return result[0] && result[0][5] !== undefined;
};

export const getBranchFromUrl = (url = '') => {
  const result = getRegexMatches(url, githubCloneRegex);
  return result[0] && result[0][5];
};

export const getSvnUrl = (url = '') => {
  const branchName = getBranchFromUrl(url);
  return url.replace(`/tree/${branchName}/`, '/trunk/');
};
