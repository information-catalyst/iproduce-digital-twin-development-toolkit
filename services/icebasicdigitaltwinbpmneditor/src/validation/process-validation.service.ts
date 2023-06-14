import * as angular from "angular";

import { IManagerService } from "_core";
import { IRegistryService, IModelingService } from "process-modeler";
import { IValidationRulesService, IValidationRule } from "./";

// the model for validation errors
export interface IProcessValidationError {

  // the offending element
  elementID: string;

  // the type of the offending element, bpmn:startEvent, activity, etc
  elementType: string;

  // the actual error description
  description: string;

}


export interface IProcessValidationService {

  /**
   * Returns true if service can perform validations
   */
  canValidate(): boolean;

  /**
   * Return list of validation errors for given modeler
   */
  getValidationErrors(): IProcessValidationError[];

  /**
   * Returns true if there are errors
   */
  hasErrors(): boolean;

}


class ProcessValidationService implements IProcessValidationService {

  static $inject = [
    "$q",
    "managerService",
    "validationRulesService",
    "registryService",
    "modelingService",
  ];

  private _errors: IProcessValidationError[];

  constructor(
    private $q: ng.IQService,
    private _managerService: IManagerService,
    private _rulesService: IValidationRulesService,
    private _registryService: IRegistryService,
    private _modelingService: IModelingService
  ) {

    this._managerService.onSelectedChanged(this.onSelectedModelerChanged.bind(this));
    this._modelingService.onChanged(this.onModelerChanged.bind(this));
  }

  private onSelectedModelerChanged(): void {

    if (this._managerService.getModeler() == null) {
      return;
    }

    this.validateErrors();
  }


  private onModelerChanged(): void {
    this.validateErrors();
  }


  private validateErrors(): void {

    this.$q( (resolve, reject) => {

      this._errors = [];
      const elements: BpmnJS.IRegistryElement[] = this._registryService.getAll();
      const rules: IValidationRule[] = this._rulesService.getValidationRules();

      elements.forEach((element) => {

        rules.forEach((rule) => {

          if (rule.canCheck(element) && !rule.isValid(element)) {

            this._errors.push({
              elementID: element.id,
              elementType: element.type,
              description : rule.errorMessage
            });

          }

        });

      });

      return resolve();

    });

  }

  /**
   * Returns true if service can perform validations
   */
  public canValidate(): boolean {
    return this._managerService.getModeler() != null;
  }

  /**
   * Returns true if there are errors
   */
  public hasErrors(): boolean {
    return this._errors && this._errors.length > 0;
  }

  /**
   * Return list of validation errors for given modeler
   */
  public getValidationErrors(): IProcessValidationError[] {
    return this._errors || [];
  }

}


// register service
angular
  .module("cremaPDE.validation")
  .service("processValidationService", ProcessValidationService);
