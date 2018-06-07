const rewire = require('../config-overrides');

module.exports = function override(config) {
  config = rewire(config);
  config.module.rules.push({
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader']
  });
  return config;
};
