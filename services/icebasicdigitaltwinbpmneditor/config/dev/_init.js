console.log("RUNNING DEV");

module.exports = function devConfig(config, env) {

  //configure source map strategy
  require("./devtool")(config, env);

  //dev server configuration
  require("./server")(config, env);

  //enable hot module reloading
  require("./hmr")(config, env);

  //set output
  require("./output")(config, env);

  return config;

};
