// Configure loader for external files 

module.exports = function setRulesFiles(config, env) {

  // Support for external files, images
  config.module.rules.push({

    test: /\.(jpg|png|gif)$/,
    use: 'file-loader?name=images/[name].[ext]',

  });


  // Support for external files, images
  config.module.rules.push({

    test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
    use: 'file-loader?name=fonts/[name].[ext]',

  });

  // Support for favicon
  config.module.rules.push({

    test: /favicon.ico$/,
    use: 'file-loader?name=/[name].[ext]',

  });

  // Configure raw loader for bpmn files
  config.module.rules.push({

    test: /\.bpmn$/,
    use: 'raw-loader',

  });

};
