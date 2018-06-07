const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config) {
  config = injectBabelPlugin('babel-plugin-transform-decorators-legacy', config);
  config = injectBabelPlugin('babel-plugin-transform-do-expressions', config);
  config = injectBabelPlugin('babel-plugin-emotion', config);
  config = injectBabelPlugin('babel-plugin-preval', config);
  return config;
};
