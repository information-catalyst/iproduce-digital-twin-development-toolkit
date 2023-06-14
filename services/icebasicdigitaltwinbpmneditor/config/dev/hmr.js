// Enable hot module replacement plugin
var webpack = require("webpack");

module.exports = function enableHMR(config, env) {

  if(env.isDev) {

    // enable HMR globally
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin()      
    );

    // prints more readable module names in the browser console on HMR updates
    config.plugins.push(
      new webpack.NamedModulesPlugin()
    );

  }

};