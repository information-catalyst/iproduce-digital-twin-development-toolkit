// Configure loader rules for styles
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function setRulesStyles(config, env) {

  // css/less support global
  config.module.rules.push(
  {
    test: /\.(less|css)$/,
    use: ExtractTextPlugin.extract({ 
      fallback: "style-loader", 
      use: [ 
        {
          loader: "css-loader",
          options: {
            minimize: env.isProd,
            sourceMap: true
          }
        }, 
        {
          loader: "less-loader",
          options: {
            sourceMap: true
          }
        } 
      ]
    })
  });


  // Global css styles, extract to file
  config.plugins.push(
    
    new ExtractTextPlugin({filename: "css/[name].css", disable: !env.isProd})

  );

};

