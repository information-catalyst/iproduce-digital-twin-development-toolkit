// Configure loader rules for ts

module.exports = function configSourceMap(config, env) {

  config.module.rules.push({
    enforce: 'pre',
    test: /\.js$/,
    loader: 'source-map-loader',
    exclude: [
      // these packages have problems with their sourcemaps
      env.path('node_modules','rxjs'),
      env.path('node_modules','/@angular')
    ]
  });

};