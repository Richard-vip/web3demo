const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();
module.exports = function override(config) {
  config.plugins = (config.plugins || []).concat([
    new webpack.SourceMapDevToolPlugin({ exclude: '/node_modules/' }),
    new NodePolyfillPlugin({
      excludeAliases: ['console'],
    }),
  ]);
  return config;
};
