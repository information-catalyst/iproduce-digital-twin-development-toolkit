// Configure loader rules for pug/jade files

module.exports = function setRulesPug(config, env) {


  // Support for .pug files.
  config.module.rules.push({

    test: /\.(pug|jade)$/,
    use: [
      'raw-loader', 
      {
        loader: 'pug-html-loader',
        options: {

          // define locals
          data: {
            DEV: env.isDev,
            PROD: env.isProd,
            VERSION: env.version
          }
        }
      }
    ],

  });

};
