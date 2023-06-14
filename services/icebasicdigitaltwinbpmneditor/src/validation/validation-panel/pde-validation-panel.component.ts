import * as angular from "angular";

import { ISelectionService } from "process-modeler";
import { IStatusPanelService } from "status-panel";

import {
  IProcessValidationService,
  IProcessValidationError,
} from "../";


class ValidationPanelController {

  static $inject = [
    "processValidationService",
    "selectionService"
  ];

  // current selected element
  public selectedError: IProcessValidationError;

  constructor(
    private _validationService: IProcessValidationService,
    private _selectionService: ISelectionService,
  ) {
  }

  public getValidationErrors(): IProcessValidationError[] {
    return this._validationService.getValidationErrors();
  }

  /**
   * User clicks on selected error, select element in diagram
   */
  public goToError(error: IProcessValidationError): void {
    this.selectedError = error;
    this._selectionService.selectById(error.elementID);
  }

}



class ValidationPanelComponent implements ng.IDirective {
  controller = ValidationPanelController;
  template = require("./pde-validation-panel.component.pug");
}


angular
  .module("cremaPDE.validation")
  .component("pdeValidationPanel", new ValidationPanelComponent())
  ;
