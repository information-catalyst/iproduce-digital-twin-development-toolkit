import * as angular from "angular";

import { IStatusPanelButton } from "../";


class StatusPanelButtonComponent implements ng.IDirective {

  bindings = {
    data: "<"
  };

  template = require("./pde-status-panel-button.component.pug");

}


// init component
angular
  .module("cremaPDE.statusPanel")
  .component("pdeStatusPanelButton", new StatusPanelButtonComponent())
  ;
