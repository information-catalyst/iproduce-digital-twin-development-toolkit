import * as angular from "angular";


class ToolbarDropdownComponent implements ng.IDirective {

  bindings = {
    data: "<"
  };

  template = require("./pde-toolbar-dropdown.component.pug");
}


// init component
angular
  .module("cremaPDE.toolbar")
  .component("pdeToolbarDropdown", new ToolbarDropdownComponent())
  ;
