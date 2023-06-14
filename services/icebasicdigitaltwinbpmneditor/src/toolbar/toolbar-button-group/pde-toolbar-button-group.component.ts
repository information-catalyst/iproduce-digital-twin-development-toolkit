import * as angular from "angular";

import { IToolbarButtonGroup, IToolbarButton } from "../";

class ToolbarButtonGroupController {

  public isDropdown(btn: IToolbarButton): string {
    return btn.children && btn.children.length > 0 ? "1" : "0";
  }
}


class ToolbarButtonGroupComponent implements ng.IDirective {

  bindings = {
    data: "<"
  };

  controller = ToolbarButtonGroupController;
  template = require("./pde-toolbar-button-group.component.pug");

}


// init component
angular
  .module("cremaPDE.toolbar")
  .component("pdeToolbarButtonGroup", new ToolbarButtonGroupComponent())
  ;
