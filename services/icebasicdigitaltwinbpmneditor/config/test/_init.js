console.log("RUNNING TEST");

module.exports = function testConfig(config, env) {

  //configure source map strategy
  require("./devtool")(config, env);

  require("./rules.istambul")(config, env);
  require("./rules.sourcemap")(config, env);

  /**
   * Disable performance hints
   *
   * See: https://github.com/a-tarasyuk/rr-boilerplate/blob/master/webpack/dev.config.babel.js#L41
   */
  config.performance = {
    hints: false
  };

  return config;

};