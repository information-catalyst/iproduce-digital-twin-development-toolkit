import * as angular from "angular";

import { IModelingService, IRegistryService, IModdleService } from "../";
import { BPMNTYPES } from "./";


export interface IAnnotatedType {
  $type: string;
}


export class BPMNPROPERTIES {
  public static CONDITION_EXPRESSION = "conditionExpression";
  public static DEFAULT_CONDITION = "default";
}



export interface IConditionExpression extends IAnnotatedType {
  body;
  language?;
}



interface IBaseCreate {

  // element to get/set annotations
  element: IRegistryElement;
}


export interface ICreateUpdateCondition extends IBaseCreate {
  body: string;
}

export interface ISetDefaultCondition extends IBaseCreate {
  def: boolean;
}



export interface IBpmnGatewayService {

  addUpdateCondition(data: ICreateUpdateCondition): IConditionExpression;
  getCondition(element: IRegistryElement): IConditionExpression;
  hasCondition(element: IRegistryElement): boolean;
  isDefaultCondition(element: IRegistryElement): boolean;
  setDefaultCondition(data: ISetDefaultCondition): void;

  /**
   * Returns true if the given gateway has all conditions set
   */
  hasAllConditionsSet(element: IRegistryElement): boolean;

}




class BpmnGatewayService implements IBpmnGatewayService {

  static $inject = [
    "modelingService",
    "moddleService",
    "registryService"
  ];

  constructor(
    private _modelingService: IModelingService,
    private _moddleService: IModdleService,
    private _registryService: IRegistryService
  ) {
  }


  private createElement($type: string, props?: any): any {
    return this._moddleService.createElement($type, props);
  }

  private getBusinessObject(element: IRegistryElement | BpmnJS.IModdleElement): BpmnJS.IModdleElement {
    return (<BpmnJS.IRegistryElement>element).businessObject
      ? (<BpmnJS.IRegistryElement>element).businessObject
      : <BpmnJS.IModdleElement>element;
  }

  private getType(element: IRegistryElement | BpmnJS.IModdleElement): string {
    return this.getBusinessObject(element).$type;
  }


  public hasCondition(element: IRegistryElement): boolean {
    const condition: IConditionExpression = this.getBusinessObject(element).get<IConditionExpression>(BPMNPROPERTIES.CONDITION_EXPRESSION);
    return condition && condition.body ? true : false;
  }

  // ads or updates a condition expression to a sequence flow, pass $type empty to remove condition
  public addUpdateCondition(data: ICreateUpdateCondition): IConditionExpression {

    const element: BpmnJS.IModdleElement = this.getBusinessObject(data.element);
    if (element.$type !== BPMNTYPES.SEQUENCE_FLOW) {
      throw "Can't add/update conditions on type " + element.$type;
    }

    const conditionExpression: IConditionExpression = this.createElement(BPMNTYPES.FORMAL_EXPRESSION);
    conditionExpression.body = data.body;

    this._modelingService.updateElement({
      element: <BpmnJS.IRegistryElement>data.element,
      propertyName: BPMNPROPERTIES.CONDITION_EXPRESSION,
      propertyValue: conditionExpression
    });

    return conditionExpression;
  }

  public getCondition(element: IRegistryElement): IConditionExpression {
    return this.getBusinessObject(element).get<IConditionExpression>(BPMNPROPERTIES.CONDITION_EXPRESSION);
  }

  public setDefaultCondition(data: ISetDefaultCondition): void {

    const source: IRegistryElement = this._registryService.getElementById(this.getBusinessObject(data.element).sourceRef.id);

    this._modelingService.updateElement({
      element: source,
      propertyName: BPMNPROPERTIES.DEFAULT_CONDITION,
      propertyValue: data.def ? data.element : null
    });
  }


  public isDefaultCondition(element: IRegistryElement): boolean {
    const source: BpmnJS.IModdleElement = this.getBusinessObject(element).sourceRef;
    return (<any>source).default === this.getBusinessObject(element);
  }


  /**
   * Returns true if the given gateway has all conditions set
   */
  public hasAllConditionsSet(element: IRegistryElement): boolean {

    const outgoing = element.outgoing;
    if (!outgoing || !outgoing.length) {
      return false;
    }

    return outgoing.filter((o) => this.isDefaultCondition(o) || this.hasCondition(o)).length === outgoing.length;
  }


}



angular
  .module("cremaPDE.processModeler")
  .service("bpmnGatewayService", BpmnGatewayService)
  ;
