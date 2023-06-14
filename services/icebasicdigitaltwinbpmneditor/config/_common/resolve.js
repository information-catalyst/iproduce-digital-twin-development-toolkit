// Set resolve options

module.exports = function setResolve(config, env) {

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  config.resolve = {   
    
    /*
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['.ts', '.js', '.json'],

    // An array of directory names to be resolved to the current directory
    // Just use simple names, no need to put relative/abs paths
    modules: ['src', 'node_modules'],

    // provide aliases for bpmnjs modules
    alias: {
      'BpmnModeler': env.path('node_modules/bpmn-js/lib/Modeler.js'),
      'BpmnNavigatedViewer': env.path('node_modules/bpmn-js/lib/NavigatedViewer.js'),
    }

  };

};


