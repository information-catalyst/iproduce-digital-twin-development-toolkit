import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";

// we use this service to select/unselect elements in process diagram, and add selection change listeners
export interface IRegistryService {

  /**
   * Get element by Id
   */
  getElementById(id: string): BpmnJS.IRegistryElement;

  /**
   * Get all elements from registry
   */
  getAll(): BpmnJS.IRegistryElement[];

  /**
   * Get graphics element from given registry element
   */
  getGraphics(element: BpmnJS.IRegistryElement): any;

}


class RegistryService implements IRegistryService {

  static $inject = [
    "managerService"
  ];

  constructor(
    private _managerService: IManagerService
  ) {}

  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  private getRegistry(): BpmnJS.IRegistryService {
    const modeler = this.getModeler();

    if (!modeler) {
      throw Error("No active modeler");
    }

    return modeler.get<BpmnJS.IRegistryService>("elementRegistry");
  }

  /**
   * Get element by Id
   */
  public getElementById(id: string): BpmnJS.IRegistryElement {
    return this.getRegistry().get(id);
  }

  /**
   * Get all elements from registry
   */
  public getAll(): BpmnJS.IRegistryElement[] {
    return this.getRegistry().getAll();
  }

  /**
   * Get graphics element from given registry element
   */
  public getGraphics(element: BpmnJS.IRegistryElement): any {
    return this.getRegistry().getGraphics(element);
  }

}


angular
  .module("cremaPDE.processModeler")
  .service("registryService", RegistryService)
  ;
