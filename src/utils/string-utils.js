export const isEmptyString = s => !(s && s.trim() !== '');

export const isLowerCase = s => s && s.trim() === s.trim().toLowerCase();

export const getHttpsGitURL = url => {
  if (url.startsWith('http')) {
    return url.replace('.git', '');
  } else if (url.startsWith('git@')) {
    return url
      .replace(':', '/')
      .replace('git@', 'https://')
      .replace('.git', '');
  }
  return url;
};

export const includesLowercase = (a, b) => a.toLowerCase().includes(b.toLowerCase());

export const getLastFromString = (str, separator) => {
  const splitted = str.split(separator);
  return splitted[splitted.length - 1];
};
