'use strict';

module.exports = {
    entry: {
        app: `${__dirname}/src/app.js`,
        background: `${__dirname}/src/background.js`
    },
    output: {
        path: `${__dirname}/app/dist`,
        publicPath: '/dist/',
        filename: "[name].bundle.js"
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            use: 'file-loader'
        }, {
            test: /\.html$/,
            use: 'html-loader'
        }]
    }
};
