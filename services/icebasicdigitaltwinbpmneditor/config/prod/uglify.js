// Configure uglify plugin
const webpack = require("webpack");

const OptimizeJsPlugin = require('optimize-js-plugin');

module.exports = function setUglifyPlugin(config, env) {

  config.plugins.push(

    /**
     * Webpack plugin to optimize a JavaScript file for faster initial load
     * by wrapping eagerly-invoked functions.
     *
     * See: https://github.com/vigneshshanmugam/optimize-js-plugin
     */
    // new OptimizeJsPlugin({
    //   sourceMap: true
    // }),


    // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // Minify all javascript, switch loaders to minimizing mode
    
    new webpack.optimize.UglifyJsPlugin({

      beautify: false, //prod
      sourceMap: true,

      exclude: /config/,

      output: {
        comments: false
      }, //prod
      mangle: {
        screw_ie8: true
      }, //prod
      compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false // we need this for lazy v8
      }
    })

  );


};
