const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  mode: 'production',
  devtool: 'none',
  output: {
    filename: 'bundle.[hash].js',
    chunkFilename: 'async.bundle[chunkhash].js',
    path: path.resolve(__dirname, '../dist')
  },

  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ["@babel/preset-env",
        "@babel/preset-react"]
      },
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    }, {
      test: /\.scss$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    }, {
      test: /\.less$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
    }]
  },
  // 公共js单独打包
  optimization: {
    splitChunks: {
      name: true,
      minSize: 30000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // name: 'vendor',
          chunks: 'all'
        },
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(['../dist']),
    // new BundleAnalyzerPlugin(), 打包图形分析
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /zh-cn/,
    ),
    new webpack.DefinePlugin({
      'process.env': { DEPLOY_ENV: '\"' +'prod' + '\"' }
    }),
    new HtmlWebpackPlugin({
      template: './index.ejs'
    }),
    new MiniCssExtractPlugin({
      filename: './index.[hash].css' //文件目录会放入output.path里
    }),
  ],
};