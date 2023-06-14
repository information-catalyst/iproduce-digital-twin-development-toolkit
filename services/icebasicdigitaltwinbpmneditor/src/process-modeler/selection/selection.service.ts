import * as angular from "angular";

import { IFactoryService, IManagerService, IProcessModeler } from "_core";
import { ICanvasService, IRegistryService } from "../";



// we use this service to select/unselect elements in process diagram, and add selection change listeners
export interface ISelectionService {

  /**
   * Get array of selected elements
   */
  get(): BpmnJS.IRegistryElement[];

  /**
   * Selects element by Id
   */
  selectById(id: string): void;

  /**
   * Select single element
   */
  select(element: BpmnJS.IRegistryElement | BpmnJS.IRegistryElement[], add?: boolean): void;

  /**
   * Deselect single or array of elements
   */
  deselect(element: BpmnJS.IRegistryElement | BpmnJS.IRegistryElement[]): void;

  /**
   * Returns true if the element or list of elements are selected
   */
  isSelected(element: BpmnJS.IRegistryElement | BpmnJS.IRegistryElement[]): boolean;

  /**
   * Hook to selection changed event
   */
  onSelectionChanged(callback: () => void): void;

}


class SelectionService implements ISelectionService {

  static $inject = [
    "managerService",
    "factoryService",
    "canvasService",
    "registryService"
  ];

  private _listeners: (() => void)[];

  constructor(
    private _managerService: IManagerService,
    private _factoryService: IFactoryService,
    private _canvasService: ICanvasService,
    private _registryService: IRegistryService) {

      this._listeners = [];

      this._factoryService.registerEvent("selection.changed", this.raiseSelectionChanged.bind(this), this);
      this._managerService.onSelectedChanged(this.raiseSelectionChanged.bind(this));
  }

  private raiseSelectionChanged(): void {

    const selection = this.get();
    this._listeners.forEach((l) => l());

  }


  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  private getSelection(): BpmnJS.ISelectionService {
    const modeler = this.getModeler();
    return modeler ? modeler.get<BpmnJS.ISelectionService>("selection") : null;
  }

  /**
   * Get array of selected elements
   */
  public get(): BpmnJS.IRegistryElement[] {
    const selection = this.getSelection();
    return selection ? selection.get() : [];
  }

  /**
   * Selects element by Id
   */
  public selectById(id: string): void {
    this.select(this._registryService.getElementById(id));
  }

  /**
   * Select single element
   */
  public select(element: BpmnJS.IRegistryElement, add?: boolean): void {
    if (!element) {
      throw "SelectionService.Element cannot be null";
    }
    this.getSelection().select(element, add);
    this._canvasService.centerTo(element);
  }

  /**
   * Deselect single or array of elements
   */
  public deselect(element: BpmnJS.IRegistryElement | BpmnJS.IRegistryElement[]): void {
    this.getSelection().deselect(element);
  }

  /**
   * Returns true if the element or list of elements are selected
   */
  public isSelected(element: BpmnJS.IRegistryElement | BpmnJS.IRegistryElement[]): boolean {
    return this.getSelection().isSelected(element);
  }

  /**
   * Hook to selection changed event
   */
  public onSelectionChanged(callback: () => void): void {
    this._listeners.push(callback);
  }

}


angular
  .module("cremaPDE.processModeler")
  .service("selectionService", SelectionService)
  ;
