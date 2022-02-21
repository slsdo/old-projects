const path = require('path')

const PATHS = {
  src: path.resolve(__dirname, './src/components'),
  build: path.resolve(__dirname, 'dist/src/js')
};

module.exports = {
  entry: {
    app: `${PATHS.src}/App.tsx`,
    book: `${PATHS.src}/Book.tsx`,
  },
  output: {
    path: PATHS.build,
    filename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {/*
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },*/
      },
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: "ts-loader"
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
};
