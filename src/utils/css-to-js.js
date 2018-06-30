import cssToJS from 'transform-css-to-js';

export default input => {
  // in case of invalid input, output the error
  try {
    const jsString = cssToJS(input);
    const formatted = correctSpacing(jsString);
    return output(formatted);
  } catch (error) {
    return error.toString();
  }
};

const output = input => {
  // default to empty string so that placeholder shows
  return input.replace(/\s/g, '') === '{}' ? '' : input;
};

const correctSpacing = target => {
  // remove weird spacing and give separator lines
  return target
    .replace(/{\n/, '{')
    .replace(/,\n/gm, ',\n\n')
    .replace(/^\s{6,}/gm, '    ');
};
