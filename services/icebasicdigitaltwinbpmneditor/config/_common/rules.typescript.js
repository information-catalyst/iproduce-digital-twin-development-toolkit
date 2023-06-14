// Configure loader rules for ts
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
module.exports = function configRulesTypescript(config, env) {


  if (env.isTest) {

    config.module.rules.push({

      test: /\.ts$/,
      loader: "awesome-typescript-loader",
      exclude: [/\.e2e\.ts$/]
      
    });

  } else {

    // Support for .ts files.
    config.module.rules.push({

      test: /\.ts$/,
      loader: "awesome-typescript-loader",
      exclude: [/\.(e2e|spec)\.ts$/]

    });

    config.plugins.push(
      /*
        * Plugin: ForkCheckerPlugin
        * Description: Do type checking in a separate process, so webpack don't need to wait.
        *
        * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
        */
        new CheckerPlugin()
    );

  }


};