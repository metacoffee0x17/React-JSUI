import cssToJS from 'transform-css-to-js';

export default input => {
  try {
    return correctSpacing(cssToJS(input));
  } catch (error) {
    return error.toString();
  }
};

const correctSpacing = target => {
  return target
    .replace(/{\n/, '{')
    .replace(/,\n/gm, ',\n\n')
    .replace(/^\s{6,}/gm, '    ');
};
