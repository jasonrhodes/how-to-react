var webpack = require('webpack')

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname + '/public/assets/js',
    publicPath: '/assets/js/',
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [],
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: './public/'
  }
};
