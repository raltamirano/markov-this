const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry : "./src/index.js",
    mode: "production",
    output: {
        filename: 'markov-this.js',
        library: 'markov'
    },    
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      })
    ]
};