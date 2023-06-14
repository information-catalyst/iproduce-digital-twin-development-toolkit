// Configure Istambul instrumenter

module.exports = function configIstambul(config, env) {

  config.module.rules.push({
    enforce: 'post',
    test: /\.(js|ts)$/,
    loader: 'istanbul-instrumenter-loader',
    include: env.path('src'),
    exclude: [
      /\.e2e\.ts$/,
      /node_modules/
    ]
  });

};