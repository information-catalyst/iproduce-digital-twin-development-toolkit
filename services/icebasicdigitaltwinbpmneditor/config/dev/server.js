// Configure dev/test server

module.exports = function configServer(config, env) {

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {

    //enable gzip compression
    //compress: true,
    //enable content base if serving static files
    //contentBase:"",
    //enable webpack hot mode
    hot: true,

    //enable https
    //https: true,
    //disable webpack bundle information log to console, errors and warnings still appear
    //noInfo: true,
    //shows a full-screen overlay in the browser when there are compiler errors or warnings, disabled by default
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }

  };


};