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

    /**
     * 
     * For loaders that embed <script> or <link> tags or reference assets like images, 
     * publicPath is used as the href or url() to the file when it’s different than their location on disk (as specified by path).
     * 
     */
    publicPath: "/",


    filename: "js/[name].js",

    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: "[file].map",

    /** The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: "[id].chunk.js",

  };

};