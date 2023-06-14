import * as angular from "angular";

import { IToolbarButton } from "../";


class ToolbarButtonComponent implements ng.IDirective {

  bindings = {
    data: "<"
  };

  template = require("./pde-toolbar-button.component.pug");

}


// init component
angular
  .module("cremaPDE.toolbar")
  .component("pdeToolbarButton", new ToolbarButtonComponent())
  ;
