

module.exports = function(env) {

  
  // main webpack configuration object
  var config = {
    
    module: {
       rules: []
    },
    
    plugins: []
  
  };


  //the entries for the bundle
  require('./entry')(config, env);

  //configure chunks
  require('./chunks')(config, env);

  //define global vars vales
  require('./defines')(config, env);

  //configure html plugin
  require('./html')(config, env);

  //configure provides
  require('./provides')(config, env);

  //module resolution options
  require('./resolve')(config, env);

  //configure external files
  require('./rules.files')(config, env);

  //configure pug
  require('./rules.pug')(config, env);

  //configure styles for angular components
  require('./rules.styles')(config, env);

  //configure typescript
  require('./rules.typescript')(config, env);

  return config;

};