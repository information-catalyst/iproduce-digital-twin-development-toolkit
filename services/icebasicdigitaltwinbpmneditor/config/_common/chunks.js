// Enable chunks plugin
const webpack = require('webpack');


module.exports = function configureChunks(config, env) {

  /*
   * Plugin: CommonsChunkPlugin
   * Description: Shares common code between the pages.
   * It identifies common modules and put them into a commons chunk.
   *
   * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
   * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
   */

  // This enables tree shaking of the vendor modules

  if (!env.isTest) {

    config.plugins.push(

      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main','config'],
        minChunks: module => /node_modules/.test(module.resource)
      })

    );

  }

};