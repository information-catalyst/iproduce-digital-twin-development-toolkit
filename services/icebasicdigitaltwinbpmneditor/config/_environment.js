// Helper functions
var path = require('path');
var root = path.resolve(__dirname, '..');
var npm_event = process.env.npm_lifecycle_event;

// create env helper
// based on npm lifetime
const exportsObj =  {

  isProd: npm_event === 'prod',

  isDev: npm_event === 'dev' || npm_event === 'start',

  isTest: npm_event === 'test',

  // concats list of strings with root path
  path: function(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [root].concat(args));
  }
};

exportsObj.version = require(exportsObj.path('package.json')).version;




module.exports = exportsObj;