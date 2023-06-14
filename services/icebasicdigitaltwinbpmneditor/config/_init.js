const env = require('./_environment');


module.exports = function initConfig() {
  
  var config = require('./_common/_init')(env); 

  if(env.isProd) {
    
    require('./prod/_init')(config, env);

  } else if(env.isTest) {

    require('./test/_init')(config, env);

  } else {

    require('./dev/_init')(config, env);

  }

  return config;

}();
