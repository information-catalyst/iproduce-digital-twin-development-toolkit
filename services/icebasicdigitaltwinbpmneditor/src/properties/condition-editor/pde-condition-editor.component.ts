import * as angular from "angular";

import { IProcessModeler} from "_core";

import {
  IBpmnGatewayService,
  IConditionExpression
} from "process-modeler";


interface IConditionProperty {
  conditionType: string;
  value: string;
}


class ConditionEditorController {

  static $inject = [
    "$element",
    "$scope",
    "bpmnGatewayService"
  ];

  // here we save either script or expression, to have it separated from the annotation
  public selectedElement: BpmnJS.IRegistryElement;
  public selectedType: string;
  public propertyValue: IConditionExpression;
  public readOnly: boolean;

  // whether this connection is the default connection or not
  public isDefault: boolean;

  constructor(
    private $element: ng.IAugmentedJQuery,
    private $scope: ng.IScope,
    private _bpmnGatewayService: IBpmnGatewayService
  ) {
  }


  private readProperty(): void {
    this.isDefault = this._bpmnGatewayService.isDefaultCondition(this.selectedElement);
    this.propertyValue = angular.extend({}, this._bpmnGatewayService.getCondition(this.selectedElement) || {});
    this.selectedType = this.propertyValue.body ? this.propertyValue.language ? "script" : "expression" : "";
  }



  /**
   * When selected element changes
   */
  public $onChanges(changes: any): void {
    if (changes.selectedElement) {
      this.readProperty();
    }
  }


  public isExpression(): boolean {
    return this.selectedType === "expression";
  }

  public isScript(): boolean {
    return this.selectedType === "script";
  }

  public isSelectedType(): boolean {
    return this.selectedType ? true : false;
  }

  public isValid(): boolean {

    if (!this.isSelectedType) {
      return true;
    }

    return this.propertyValue.body && this.propertyValue.body.length ? true : false;
  }


  public defaultChanged(): void {

    this._bpmnGatewayService.setDefaultCondition({
      element: this.selectedElement,
      def: this.isDefault
    });

  }


  public valueChanged(prop: string): void {

    if (!this.isValid()) {
      return;
    }

    if (!this.selectedType) {
      this.propertyValue.body = "";
    }

    this._bpmnGatewayService.addUpdateCondition({
      element: this.selectedElement,
      body: this.propertyValue.body
    });

  }

}



class ConditionEditorComponent implements ng.IDirective {

  bindings = {
    readOnly: "<",
    selectedElement: "<",
  };

  controller = ConditionEditorController;
  template = require("./pde-condition-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeConditionEditor", new ConditionEditorComponent())
  ;
