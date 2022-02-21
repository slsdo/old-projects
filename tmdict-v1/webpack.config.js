var webpack = require('webpack');
var path = require('path');

const PATHS = {
    src: path.resolve(__dirname, 'src/js'),
    dist: path.resolve(__dirname, 'dist/src/js'),
    dev: path.resolve(__dirname, 'dist/')
};

module.exports = {
  entry: {
    app: PATHS.src + '/bamboo.jsx',
    book: PATHS.src + '/kara.jsx',
    vendor: ['react', 'react-dom', 'page', 'lodash/forEach', 'lodash/groupBy', 'lodash/sortBy', 'lodash/flatten', 'lodash/uniq']
  },
  output: {
    path: PATHS.dist,
    filename: '[name].bundle.js',
    publicPath: '/src/js'
  },
  external: {
    glossary: 'glossary'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  eslint: {
    failOnWarning: false,
    failOnError: true
  },
  devServer: {
    contentBase: PATHS.dev,
    inline: true,
    progress: true,
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT
  }
};