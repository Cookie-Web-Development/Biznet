// webpack.config.js
const path = require('path');
const glob = require('glob');

module.exports = {
    mode: 'production',
    entry: {     // Use glob to match all JavaScript files in src/client and subdirectories
        ...glob.sync('./dist/client/**/*.js').reduce((entries, file) => {
          const entryName = path.relative(path.join(__dirname, 'dist/client'), file);
          console.log('HAKUNA entryName')
          console.log(entryName);
          entries[entryName] = file;
          console.log('MATATA entries')
          console.log(entries)
          return entries;
        }, {}),},
    output: {
        filename: '[name]', // Output file name
        path: path.resolve(__dirname, 'dist/client'), // Output directory
    },
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/, // Match JavaScript files
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader', // Use Babel for transpilation
    //                 options: {
    //                     presets: ['@babel/preset-env'], // Use the @babel/preset-env preset
    //                 },
    //             },
    //         },
    //     ],
    // },
    resolve: {
        preferRelative: true, // Add this line to enable preferRelative
      },
};
