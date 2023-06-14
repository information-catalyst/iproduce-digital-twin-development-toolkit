import * as angular from "angular";

import {
  IFactoryService,
  IManagerService,
  IProcessModeler
} from "_core";

import {
  BPMNTYPES,
  IRegistryService
} from "../";


export interface ICanvasService {


  /**
   * Returns true if the diagram operations are allowed
   */
  areOperationsAllowed(): boolean;

  /**
   * Returns current diagram zoom
   */
  getZoom(): number;

  /**
   * Increase current diagram zoom
   */
  increaseZoom(): void;

  /**
   * Decrease current diagram zoom
   */
  decreaseZoom(): void;

  /**
   * Sets current diagram zoom, it can be 'fit' for fit to window or a numeric value
   */
  setZoom(value: string | number): void;

  /**
   * Adds given css class to the given element id
   */
  addMarker(elementId: string, cssClass: string): void;

  /**
   * Removes given css class from the given element id
   */
  removeMarker(elementId: string, cssClass: string): void;

  /**
   * Center view to element id
   */
  centerToId(elementId: string): void;

  /**
   * Center view to element
   */
  centerTo(element: BpmnJS.IRegistryElement): void;

  /**
   * Get diagram root element
   */
  getRootElement(): BpmnJS.IRegistryElement;

  /**
   * Get diagram view box
   */
  getViewbox(): BpmnJS.ICanvasViewBox;

  /**
   * Update diagram view box
   */
  setViewbox(view: BpmnJS.ICanvasViewBox): void;

  /**
   * Get diagram default layer
   */
  getDefaultLayer(): any;

  /**
   * Raise resized event
   */
  raiseResized(): void;

  /**
   * Attach to on shape added
   */
  onShapeAdded(callback: () => void): void;

  /**
   * Attach to on shape added
   */
  onShapeRemoved(callback: () => void): void;

  /**
   * Attach to on connection added
   */
  onConnectionAdded(callback: () => void): void;

  /**
   * Attach to on connection removed
   */
  onConnectionRemoved(callback: () => void): void;

  /**
   * Attach to viewbox changed
   */
  onViewboxChanged(callback: () => void): void;

  /**
   * Attach to resized event
   */
  onResized(callback: () => void): void;

}

class CanvasService implements ICanvasService {

  static $inject = [
    "managerService",
    "registryService",
    "factoryService"
  ];

  private _shapeAddedListeners: ((evt: any) => void)[];
  private _shapeRemovedListeners: ((evt: any) => void)[];
  private _connectionAddedListeners: ((evt: any) => void)[];
  private _connectionRemovedListeners: ((evt: any) => void)[];
  private _viewboxChangedListeners: ((evt: any) => void)[];
  private _canvasResizedListeners: ((evt: any) => void)[];


  constructor(
    private _managerService: IManagerService,
    private _registryService: IRegistryService,
    private _factoryService: IFactoryService
  ) {

    this._shapeAddedListeners = [];
    this._shapeRemovedListeners = [];
    this._connectionAddedListeners = [];
    this._connectionRemovedListeners = [];
    this._viewboxChangedListeners = [];
    this._canvasResizedListeners = [];

    this._factoryService.registerEvent("shape.added", this.raiseShapeAdded.bind(this), this);
    this._factoryService.registerEvent("shape.removed", this.raiseShapeRemoved.bind(this), this);
    this._factoryService.registerEvent("connection.added", this.raiseConnectionAdded.bind(this), this);
    this._factoryService.registerEvent("connection.removed", this.raiseConnectionRemoved.bind(this), this);
    this._factoryService.registerEvent("canvas.viewbox.changed", this.raiseViewboxChanged.bind(this), this);
    this._factoryService.registerEvent("canvas.resized", this.raiseCanvasResized.bind(this), this);

  }

  private raiseShapeAdded(evt: any): void {
    this._shapeAddedListeners.forEach((c) => c(evt));
  }

  private raiseShapeRemoved(evt: any): void {
    this._shapeRemovedListeners.forEach((c) => c(evt));
  }

  private raiseConnectionAdded(evt: any): void {
    this._connectionAddedListeners.forEach((c) => c(evt));
  }

  private raiseConnectionRemoved(evt: any): void {
    this._connectionRemovedListeners.forEach((c) => c(evt));
  }

  private raiseViewboxChanged(evt: any): void {
    this._viewboxChangedListeners.forEach((c) => c(evt));
  }

  private raiseCanvasResized(evt: any): void {
    this._canvasResizedListeners.forEach((c) => c(evt));
  }


  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  private getCanvas(): BpmnJS.ICanvasService {
    const modeler = this.getModeler();
    return modeler ? this.getModeler().get<BpmnJS.ICanvasService>("canvas") : null;
  }

  private getZoomScroll(): BpmnJS.IZoomScrollService {
    return this.getModeler().get<BpmnJS.IZoomScrollService>("zoomScroll");
  }

  /**
   * Returns true if the diagram operations are allowed
   */
  public areOperationsAllowed(): boolean {
    return this.getModeler() != null ? true : false;
  }

  /**
   * Returns current diagram zoom
   */
  public getZoom(): number {

    if (!this.getModeler()) {
      return 0;
    }

    return this.getCanvas().zoom() * 100;
  }

  /**
   * Increase current diagram zoom
   */
  public increaseZoom(): void {
    this.getZoomScroll().stepZoom(1);
  }

  /**
   * Decrease current diagram zoom
   */
  public decreaseZoom(): void {
    this.getZoomScroll().stepZoom(-1);
  }

  /**
   * Sets current diagram zoom, it can be 'fit' for fit to window or a numeric value
   */
  public setZoom(value: string | number): void {

    if (value === "fit") {
      this.getZoomScroll().reset();
    } else {
      this.getCanvas().zoom(<number>value);
    }

  }

  /**
   * Adds given css class to the given element id
   */
  public addMarker(elementId: string, cssClass: string): void {
    this.getCanvas().addMarker(elementId, cssClass);
  }

  /**
   * Removes given css class from the given element id
   */
  public removeMarker(elementId: string, cssClass: string): void {
    this.getCanvas().removeMarker(elementId, cssClass);
  }

  /**
   * Get diagram root element
   */
  public getRootElement(): BpmnJS.IRegistryElement {
    const canvas = this.getCanvas();
    return canvas ? this.getCanvas().getRootElement() : null;
  }

  /**
   * Get diagram view box
   */
  public getViewbox(): BpmnJS.ICanvasViewBox {
    return this.getCanvas().viewbox();
  }

  /**
   * Update diagram view box
   */
  public setViewbox(view: BpmnJS.ICanvasViewBox): void {
    this.getCanvas().viewbox(view);
  }

  /**
   * Get diagram default layer
   */
  public getDefaultLayer(): any {
    return this.getCanvas().getDefaultLayer();
  }

  /**
   * Center view to element id
   */
  public centerToId(id: string): void {
    this.centerTo(this._registryService.getElementById(id));
  }

  /**
   * Center view to element
   */
  public centerTo(element: BpmnJS.IRegistryElement): void {

    const viewbox: BpmnJS.ICanvasViewBox = this.getViewbox();

    let elementX: number = element.x;
    let elementY: number = element.y;
    if (!elementX && element.type === BPMNTYPES.SEQUENCE_FLOW) {
      elementX = (<any>element).waypoints[0].original.x;
      elementY = (<any>element).waypoints[0].original.y;
    }

    const newViewbox: BpmnJS.ICanvasViewBox = {
      x: (elementX + element.width / 2) - viewbox.width / 2,
      y: (elementY + element.height / 2) - viewbox.height / 2,
      width: viewbox.width,
      height: viewbox.height
    };

    this.setViewbox(newViewbox);

  }

  /**
   * Raise resized event
   */
  public raiseResized(): void {
    const canvas = this.getCanvas();
    if (canvas) {
      this.getCanvas().resized();
    }
  }

  /**
   * Attach to on shape added
   */
  public onShapeAdded(callback: () => void): void {
    this._shapeAddedListeners.push(callback);
  }

  /**
   * Attach to on shape added
   */
  public onShapeRemoved(callback: () => void): void {
    this._shapeRemovedListeners.push(callback);
  }

  /**
   * Attach to on connection added
   */
  public onConnectionAdded(callback: () => void): void {
    this._connectionAddedListeners.push(callback);
  }

  /**
   * Attach to on connection removed
   */
  public onConnectionRemoved(callback: () => void): void {
    this._connectionRemovedListeners.push(callback);
  }

  /**
   * Attach to viewbox changed
   */
  public onViewboxChanged(callback: () => void): void {
    this._viewboxChangedListeners.push(callback);
  }

  /**
   * Attach to resized event
   */
  public onResized(callback: () => void): void {
    this._canvasResizedListeners.push(callback);
  }


}


angular
  .module("cremaPDE.processModeler")
  .service("canvasService", CanvasService)
  ;
