import "./app.ts";
import "angular-mocks";

const testContext = (<any>require).context("./", true, /\.spec\.ts/);

/**
 * Get all the files, for each file, call the context function
 * that will require the file and load it up here. Context will
 * loop and require those spec files here
 */
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

/**
 * Requires and returns all modules that match
 */
requireAll(testContext);
