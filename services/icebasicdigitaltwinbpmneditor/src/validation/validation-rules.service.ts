import * as angular from "angular";


/**
 * Describes a validation rule
 */
export interface IValidationRule {

  /**
   * Whether to process this rule for the given element
   */
  canCheck(element: BpmnJS.IRegistryElement): boolean;

  /**
   * Error message to be displayed
   */
  errorMessage: string;

  /**
   * Action callback to be executed for checking element's validity
   */
  isValid(element: BpmnJS.IRegistryElement): boolean;
}

/**
 * Describe service holding validation rules common to all processes
 */
export interface IValidationRulesService {

  /**
   * Add validation rule to the list or rules for checking
   */
  addValidationRule(rule: IValidationRule): void;

  /**
   * Return list of validation rules
   */
  getValidationRules(): IValidationRule[];

}


class ValidationRulesService implements IValidationRulesService {

  private _validationRules: IValidationRule[];

  constructor() {
    this._validationRules = [];
  }

  /**
   * Add validation rule to the list or rules for checking
   */
  public addValidationRule(rule: IValidationRule): void {

    if (!rule || !rule.canCheck  || !rule.isValid || !rule.errorMessage) {
      throw new Error("ValidationRulesService.Add Rule All parameters are required");
    }

    this._validationRules.push(rule);
  }

  /**
   * Return list of validation rules
   */
  public getValidationRules(): IValidationRule[] {
    return this._validationRules;
  }

}


// register service
angular
  .module("cremaPDE.validation")
  .service("validationRulesService", ValidationRulesService);
