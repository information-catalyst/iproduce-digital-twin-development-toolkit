// Enable defines in code
const webpack = require('webpack');


module.exports = function setDefinePlugin(config, env) {

  const defValues = {
    __IN_PROD__: env.isProd,
    __IN_DEV__: env.isDev,
    __IN_TEST__: env.isTest,
    __VERSION__ : JSON.stringify(env.version),
  };

  config.plugins.push(new webpack.DefinePlugin(defValues));

};
