// Sets entries according to environment

module.exports = function configEntry(config, env) {

  // if not test

  /**
   * The entry point for the bundle
   * Our Angular.js app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */

  if (!env.isTest) {

    config.entry = {
      'main': './src/app.ts',
      'config': './src/config.ts',
    };
  }

};
