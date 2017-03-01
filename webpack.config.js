const { resolve } = require('path')
const webpack = require('webpack')

module.exports = {
  context: __dirname,
  entry: {
    app: [
      'react-hot-loader/patch',
      resolve(__dirname, 'client/index.jsx'),
      'webpack-dev-server/client?http://localhost:8000',
      'webpack/hot/only-dev-server',
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'public'),
    publicPath: '/',
  },
  output: {
    path: resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false,
  },
  externals: {
    // 'cheerio': 'window',
    'react/addons': 'react',
    'jsdom': 'window',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          // { loader: 'sass-loader', options: { sourceMap: false } },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: { loader: 'url-loader', options: { limit: 10000, minetype: 'application/font-woff' } },
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: resolve(__dirname, 'client/fonts'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
}
