import * as angular from "angular";

import { IProcessModeler } from "_core";
import { ISelectionService } from "process-modeler";

import {
  IProcessValidationService,
  IProcessValidationError,
} from "../";


class ImportWarningsPanelController {

  static $inject = [
    "processValidationService",
    "selectionService"
  ];

  constructor(
    private validationService: IProcessValidationService,
    private selectionService: ISelectionService,
  ) {
  }

}



class ImportWarningsPanelComponent implements ng.IDirective {
  controller = ImportWarningsPanelController;
  template = require("./pde-import-warnings-panel.component.pug");
}


angular
  .module("cremaPDE.validation")
  .component("pdeImportWarningsPanel", new ImportWarningsPanelComponent())
  ;
