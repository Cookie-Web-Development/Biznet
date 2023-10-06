// webpack.config.js
const path = require('path');
const glob = require('glob');
// const PugPlugin = require('pug-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');


module.exports = [
  {
    mode: 'production',
    entry: {
      ...glob.sync('./dist/client/**/*.js').reduce((entries, file) => {
        const entryName = path.relative(path.join(__dirname, 'dist/client'), file);
        entries[entryName] = file;
        return entries;
      }, {}),
    },
    output: {
      filename: path.join('client', '[name]'),
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      preferRelative: true,
    }
  }
];