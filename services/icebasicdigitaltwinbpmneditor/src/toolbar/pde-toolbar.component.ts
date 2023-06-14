import * as angular from "angular";

import { IToolbarService, IToolbarButtonGroup, IToolbarButton } from "./toolbar.service";

class ToolbarComponentController {

  static $inject = [
    "toolbarService"
  ];


  constructor(
    private _toolbarService: IToolbarService,
  ) {

  }

  /**
   * Returns list of button groups registered at service level
   */
  public getLeftButtonGroups(): IToolbarButtonGroup[] {
    return this._toolbarService.getLeftButtonGroups();
  }

  public getRightButtonGroups(): IToolbarButtonGroup[] {
    return this._toolbarService.getRightButtonGroups();
  }

}


class ToolbarComponent implements ng.IDirective {
  controller = ToolbarComponentController;
  template = require("./pde-toolbar.component.pug");
}


// init component
angular
  .module("cremaPDE.toolbar")
  .component("pdeToolbar", new ToolbarComponent())
  ;
