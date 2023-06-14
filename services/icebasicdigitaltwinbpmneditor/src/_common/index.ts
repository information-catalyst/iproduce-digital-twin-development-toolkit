import * as angular from "angular";

import "angular-animate";
import "angular-ui-bootstrap";
import "angular-file-saver";
import "angular-bootstrap-colorpicker";
import "angular-local-storage";
import "jquery.scrollbar";


// define main cremaPDE common module
angular.module("cremaPDE.common", [
  "ngAnimate",
  "ui.bootstrap",
  "ngFileSaver",
  "colorpicker.module",
  "jQueryScrollbar",
  "LocalStorageModule"
]);



import "./components";
import "./constants";
import "./directives";
import "./plugins";

export * from "./constants";
export * from "./services";
