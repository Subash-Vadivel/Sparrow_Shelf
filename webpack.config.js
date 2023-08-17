const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './client/src/index.js',
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-optional-chaining'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
              test: /\.(jpg|png|avif|jpeg)$/,
              use: {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash].[ext]', // This will preserve the original filename and add a hash for cache busting
                  outputPath: 'assets/', // Output directory inside 'client/dist/'
                  publicPath: 'http://localhost:5000/dist/assets/' // Public URL path for the assets
                },
              },
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
        }
    },
    output: {
        path: path.join(__dirname, 'client/dist/'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'client/dist/'),
        disableHostCheck: true,
        port: 5000,
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};