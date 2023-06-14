console.log("RUNNING PROD");

module.exports = function devConfig(config, env) {

  require("./devtool")(config, env);

  //The output for the bundle
  require("./uglify")(config, env);

  //dev server configuration
  require("./output")(config, env);

  return config;

};
