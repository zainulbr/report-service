const path = require('path')
const nodeExternals = require('webpack-node-externals')
const resolve = (...paths) => path.resolve(__dirname, '..', ...paths)
const NodemonPlugin = require('nodemon-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const configFunc = (env) => {
  const optLint = env.lint
  const optProduction = env.target === 'production'
  // override from webpack's argument if not set
  if (optProduction && process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV = 'production'
  }

  const plugins = [new NodemonPlugin()]

  if (optLint) {
    plugins.unshift(
      new ESLintPlugin({
        files: ['src'],
        extensions: ['js', 'ts'],
        emitError: true,
        failOnError: false,
        formatter: require('eslint-friendly-formatter'),
        fix: true,
      }),
    )
  }

  return {
    mode: optProduction ? 'production' : 'development',
    entry: resolve('./src/index.ts'),
    target: 'node',
    output: {
      path: resolve('dist'),
      filename: 'report.js',
    },
    plugins: plugins,
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder,
    resolve: {
      extensions: ['.js', '.ts'],
      alias: {
        '@': resolve('src/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            compact: optProduction,
          },
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
          exclude: /node_modules/,
        },
      ],
    },
    cache: optProduction
      ? false
      : {
          type: 'filesystem',
          cacheDirectory: path.resolve(__dirname, '.temp_cache'),
        },
    devtool: optProduction ? false : 'source-map',
  }
}

module.exports = configFunc
