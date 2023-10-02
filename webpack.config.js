// webpack.config.js
const path = require('path');
const glob = require('glob');

module.exports = {
    mode: 'production',
    entry: {     // Use glob to match all JavaScript files in src/client and subdirectories
        ...glob.sync('./dist/client/**/*.js').reduce((entries, file) => {
          const entryName = path.relative(path.join(__dirname, 'dist/client'), file);
          entries[entryName] = file;
          return entries;
        }, {}),},
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'dist/client'),
    },
    resolve: {
        preferRelative: true,
      },
};
