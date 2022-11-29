// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dirName = path.resolve(__dirname);
const CompressionPlugin = require('compression-webpack-plugin'); //gzip
const BrotliPlugin = require('brotli-webpack-plugin'); //brotli
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  cache: true,
  context: dirName,
  entry: {
    frontend: ['react-hot-loader/patch', './frontend/main.js'],
  },
  devtool: 'cheap-module-source-map',
  externals: {
    django: 'django',
  },
  devServer: {
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  output: {
    filename: '[name].js',
    publicPath: 'http://localhost:4000/static/',
    path: path.join(__dirname, 'build'),
  },
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: ['node_modules/**'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.join(dirName, 'common'), path.join(dirName, 'frontend')],
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        include: path.join(__dirname, 'static'),
        use: ['babel-loader?presets[]=env', 'svg-react-loader'],
      },
      {
        test: /\.scss$/,
        include: dirName,
        use: [
          'style-loader',
          'css-loader?localIdentName=[path][name]--[local]',
          'postcss-loader?localIdentName=[path][name]--[local]',
          `sass-loader?outputStyle=expanded&includePaths[]=${dirName}`,
        ],
      },
      {
        test: /\.css$/,
        include: dirName,
        use: ['style-loader', 'css-loader?localIdentName=[path][name]--[local]'],
      },
    ],
  },

  plugins: [
    /*
    new FlowBabelWebpackPlugin({
      warn: true,
    }),
    */
    // new webpack.HotModuleReplacementPlugin(),
    new CompressionPlugin({
      //gzip plugin
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new BrotliPlugin({
      //brotli plugin
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new BundleAnalyzerPlugin(),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.json'],
    alias: {
      modules: path.resolve(__dirname, 'common', 'modules'),
      common: path.resolve(__dirname, 'common'),
      app: path.resolve(__dirname, 'frontend'),
      frontend: path.resolve(__dirname, 'frontend'),
      static: path.resolve(__dirname, 'static'),
    },
  },
};
