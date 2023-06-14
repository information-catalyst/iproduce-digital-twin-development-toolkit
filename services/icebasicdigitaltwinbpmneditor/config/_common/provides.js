// because some libraries expect $ as global var, including telling Angular that jQuery exists
// See: https://webpack.js.org/guides/shimming/
var webpack = require("webpack");

module.exports = function setProvides(config, env) {

  config.plugins.push(

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    })
    
  );

};