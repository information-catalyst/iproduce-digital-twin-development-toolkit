/**
 * @author: @AngularClass
 */

var env = require('./_environment');

module.exports = function (config) {

config.set({
    // base path used to resolve all patterns
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files/patterns to load in the browser
    files: [
       'src/test.spec.ts'
    ],

    // files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { 'src/**/*.ts': ['webpack'] },

    webpack: require('./_init'),

    // required to fix error in chrome 54, error executed 0 of 0, https://github.com/karma-runner/karma-chrome-launcher/issues/94
		mime: {
		  'text/x-typescript': ['ts','tsx']
		},

    reporters: ['mocha', 'coverage', 'remap-coverage'],

    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage/html'
    },

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: true,
    // if true, Karma runs tests once and exits
    singleRun: false
  });


};
