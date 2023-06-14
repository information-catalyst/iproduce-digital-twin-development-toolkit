import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";
import { BPMNTYPES } from "../";

export interface IModdleService {

  /**
   * Create business object and properties
   */
  createElement($type: string, props?: any);

  /**
   * Access to element extension elements, pass true for create
   */
  getExtensions<T>(element: BpmnJS.IModdleElement, create?: boolean): T;

}

class ModdleService implements IModdleService {


  static $inject = [
    "managerService"
  ];


  constructor(
    private _managerService: IManagerService
  ) {}


  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  private getModdle(): BpmnJS.IModdleService {
    return this.getModeler().get<BpmnJS.IModdleService>("moddle");
  }

  /**
   * Create business object and properties
   */
  public createElement($type: string, props?: any): any {
    return this.getModdle().create($type, props);
  }


  /**
   * Access to element extension elements, pass true for create
   */
  public getExtensions<T>(element: BpmnJS.IModdleElement, create?: boolean): T {

    if (element.extensionElements) {
      return element.extensionElements;
    } else if (!create) {
      return null;
    }

    element.extensionElements = this.createElement(BPMNTYPES.EXTENSIONS);
    element.extensionElements.values = [];
    return element.extensionElements;
  }

}


angular
  .module("cremaPDE.processModeler")
  .service("moddleService", ModdleService)
  ;
