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
        }
      ]
    }
};