// Sets dev tool according to environment

module.exports = function setDevTool(config, env) {

  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */

  config.devtool = "source-map";

};