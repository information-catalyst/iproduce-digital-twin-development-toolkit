import * as angular from "angular";

import { IModelingService, IRegistryService, IModdleService } from "../";
import { BPMNTYPES } from "./";


export interface IBpmnTypesService {

  canHaveIncoming(element: IRegistryElement | IModdleElement): boolean;
  canHaveOutgoing(element: IRegistryElement | IModdleElement): boolean;

  hasColor(element: IRegistryElement | IModdleElement): boolean;
  hasIncoming(element: IRegistryElement | IModdleElement): boolean;
  hasOutgoing(element: IRegistryElement | IModdleElement): boolean;

  isEvent(element: IRegistryElement | IModdleElement): boolean;
  isStartEvent(element: IRegistryElement | IModdleElement): boolean;

  isGateway(element: IRegistryElement | IModdleElement): boolean;
  isParallelGateway(element: IRegistryElement | IModdleElement): boolean;
  isInclusiveGateway(element: IRegistryElement | IModdleElement): boolean;
  isExclusiveGateway(element: IRegistryElement | IModdleElement): boolean;

  isActivity(element: IRegistryElement | IModdleElement): boolean;

  isSequenceFlow(element: IRegistryElement | IModdleElement): boolean;

  isServiceTask(element: IRegistryElement | IModdleElement): boolean;
  isSubProcess(element: IRegistryElement | IModdleElement): boolean;
  isSubProcessExpanded(element: IRegistryElement | IModdleElement): boolean;
  isProcess(element: IRegistryElement | IModdleElement): boolean;

}




class BpmnTypesService implements IBpmnTypesService {

  static $inject = [
    "moddleService"
  ];

  constructor(
    private _moddleService: IModdleService,
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
    return (<IRegistryElement>element).type || this.getBusinessObject(element).$type;
  }


  public canHaveIncoming(element: IRegistryElement | IModdleElement): boolean {
    return /End|Gateway|Task|SubProcess|Intermediate/.test(this.getType(element));
  }


  public canHaveOutgoing(element: IRegistryElement | IModdleElement): boolean {
    return /Start|Gateway|Task|SubProcess|Intermediate/.test(this.getType(element));
  }


  public hasIncoming(element: IRegistryElement | IModdleElement): boolean {
    return element.incoming && element.incoming.length > 0;
  }

  public hasOutgoing(element: IRegistryElement | IModdleElement): boolean {
    return element.outgoing && element.outgoing.length > 0;
  }



  public hasColor(element: IRegistryElement | IModdleElement): boolean {
    const bi = this.getBusinessObject(element);
    return bi && bi.di && (bi.di.fill || bi.di.stroke) ? true : false;
  }

  public isEvent(element: IRegistryElement | IModdleElement): boolean {
    return /Event/gi.test(this.getType(element));
  }

  public isStartEvent(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element).indexOf("StartEvent") >= 0;
  }

  public isGateway(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element).indexOf("Gateway") >= 0;
  }

  public isExclusiveGateway(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element) === BPMNTYPES.EXCLUSIVE_GATEWAY;
  }

  public isInclusiveGateway(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element) === BPMNTYPES.INCLUSIVE_GATEWAY;
  }

  public isParallelGateway(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element) === BPMNTYPES.PARALLEL_GATEWAY;
  }

  public isActivity(element: IRegistryElement | IModdleElement): boolean {
    return /Process|Task/gi.test(this.getType(element));
  }

  public isProcess(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element) === BPMNTYPES.PROCESS;
  }

  public isServiceTask(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element) === "ServiceTask";
  }

  public isSubProcess(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element).indexOf("SubProcess") >= 0;
  }

  public isSubProcessExpanded(element: IRegistryElement | IModdleElement): boolean {

    if (this.isSubProcess(element)) {
      return (<any>element).collapsed === false;
    }

    return false;
  }


  public isSequenceFlow(element: IRegistryElement | IModdleElement): boolean {
    return this.getType(element) === BPMNTYPES.SEQUENCE_FLOW;
  }


}



angular
  .module("cremaPDE.processModeler")
  .service("bpmnTypesService", BpmnTypesService)
  ;
