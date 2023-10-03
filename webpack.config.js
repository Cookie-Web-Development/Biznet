// webpack.config.js
const path = require('path');
const glob = require('glob');
//const PugPlugin = require('pug-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');


module.exports = {
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
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader'],
      },
    ]
  },
  plugins: [
    ...glob
      .sync('./views/**/*.pug')
      .map((templateFile) => {
        const filename = path
        .relative(path.join(__dirname, 'views'), templateFile);
        return new HtmlWebpackPlugin({
          template: templateFile,
          filename: path.join('views', filename),
          minify: false
        })
      }),
    new HtmlWebpackPugPlugin({
      adjustIndent: true,
      css: {
        filename: 'public/css/[name].[contenthash:8].css'
      }
    })
  ]
};


/*
  plugins: [
    // Create an HtmlWebpackPlugin instance for each Pug template
    ...glob
      .sync('./src/views/**\/*.pug') // Use ** to find Pug files recursively
      .map((templateFile) => {
        const filename = path
          .relative(path.join(__dirname, 'src/views'), templateFile)
          .replace(/\.pug$/, '.html');
        return new HtmlWebpackPlugin({
          template: templateFile,
          filename: filename,
        });
      }),
  ],



{
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.pug',
      filename: 'index.pug',
      minify: false
    }),
    new HtmlWebpackPugPlugin({
      adjustIndent: true
    })
  ]
}







    ...glob
      .sync('./views/**\/*.pug')
      .map((templateFile) => {
        const filename = path
          .relative(path.join(__dirname, 'views'), templateFile)
          .replace(/\.pug$/, '.html');
        return new HtmlWebpackPlugin({
          template: templateFile,
          filename: path.join('views', filename),
          minify: false
        })
      }),
    new HtmlWebpackPugPlugin({
      adjustIndent: true
    })
*/

/*
module.exports = [
  {
    mode: 'production',
    entry: {
      ...glob.sync('./dist/client/*\/*.js').reduce((entries, file) => {
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
  },
  {
    mode: 'production',
    entry: {
      ...glob.sync('./views/**\/*.pug').reduce((entries, file) => {
        const entryName = path.relative(path.join(__dirname, 'views'), file);
        entries[entryName] = file;
        return entries;
      }, {}),
    },
    output: {
      filename: path.join('views', '[name]'),
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      preferRelative: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['css-loader'],
        },
      ]
    },
    plugins: [
      new PugPlugin({
        pretty: true,
        css: {
          filename: 'public/css/[name].[contenthash:8].css'
        }
      })
    ]
  }
];


*/