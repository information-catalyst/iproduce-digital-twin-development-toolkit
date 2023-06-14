import * as angular from "angular";

// define cremaPDE header  module
angular.module("cremaPDE.toolbar", []);

import "./toolbar-button";
import "./toolbar-dropdown";
import "./toolbar-button-group";

import "./pde-toolbar.component";
import "./toolbar.service";

export * from "./toolbar.service";
