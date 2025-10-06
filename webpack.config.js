const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            scriptLoading: 'defer',
            inject: 'head',
        }),
    ],
    output: {
        filename: '[name].js',
        clean: true,
        path: path.resolve(__dirname, 'public/assets/js'),
        publicPath: "/assets/js/"
    },
    devServer: {
        open: true,
        static: './public/'
    },
    optimization: {
        runtimeChunk: 'single'
    }
};
