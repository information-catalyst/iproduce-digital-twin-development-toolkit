// Enable html plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = function setHtmlWebpackPlugin(config, env) {

  /*
  * Plugin: HtmlWebpackPlugin
  * Description: Simplifies creation of HTML files to serve your webpack bundles.
  * This is especially useful for webpack bundles that include a hash in the filename
  * which changes every compilation.
  *
  * See: https://github.com/ampedandwired/html-webpack-plugin
  */

  if(!env.isTest) {

    config.plugins.push(new HtmlWebpackPlugin({
      
      template: env.path('src', 'index.pug'),
      chunksSortMode: 'dependency',
      hash: true,
      inject: true,

    }));

  }


};
