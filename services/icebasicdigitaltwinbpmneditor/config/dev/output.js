// Sets bundle output

module.exports = function setOutput(config, env) {

  // if not in test

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   */
  config.output = {
    
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: env.path("dist"),

    publicPath: "http://localhost:8080/",


    filename: "js/[name].js",

    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: "[file].map",

    // when using source map = eval, improves source map translation
    // pahtinfo: true,

    /** The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: "[id].chunk.js",

    devtoolModuleFilenameTemplate: './[resource-path]',

    library: '[name]_lib',
    libraryTarget: 'var'

  };

};