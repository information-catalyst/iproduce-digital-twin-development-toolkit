import * as angular from "angular";

import { IManagerService, IProcessModeler, IFactoryService } from "_core";
import { ICanvasService } from "../";


/**
 * Base command for creating elements in BPMN diagram
 */
interface IBaseCreateOptions {

  /**
   * One of the valid bpmn:types
   */
  type: string;

  /**
   * Optional creating function, to add annotations to the newly element and correctly support undo/redo operation
   */
  onCreating?: (e: BpmnJS.IRegistryElement) => void;
}


/**
 * Command used for create a new element at specific position
 */
export interface ICreateElementOptions extends IBaseCreateOptions {

  // where we want the element to be placed
  x: number;
  y: number;

}

/**
 * Command used for start dragging a new element
 */
export interface IStartElementOptions extends IBaseCreateOptions {
  /**
   * Required, mouse event for start dragging
   */
  event: any;
}


/**
 * Command used for updating elements with undo/redo support
 */
export interface IUpdateElementOptions {

  element: BpmnJS.IRegistryElement;

  // the property and its new value
  propertyName: string;
  propertyValue: any;
}


/**
 * Service for manage create/update elements in BPMN diagram
 */
export interface IModelingService {

  /**
   * Create new element at specific position
   */
  createElement(options: ICreateElementOptions): void;

  /**
   * Create new element by drag and drop
   */
  startElement(options: IStartElementOptions): void;

  /**
   * Update existing element with undo/redo support
   */
  updateElement(options: IUpdateElementOptions): void;

  /**
   * Hook to modeler changed event
   */
  onChanged(callback: () => void): void;
}


/**
 * Service for manage create/update elements in BPMN diagram
 */
class ModelingService implements IModelingService {


  static $inject = [
    "managerService",
    "canvasService",
    "factoryService",
  ];

  private _changedListeners: ((evt: any) => void)[];

  constructor(
    private _managerService: IManagerService,
    private _canvasService: ICanvasService,
    private _factoryService: IFactoryService,
  ) {

    this._changedListeners = [];
    this._factoryService.registerEvent("elements.changed", this.raiseChanged.bind(this), this);
  }


  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  private getDragging(): BpmnJS.IDraggingService {
    return this.getModeler().get<BpmnJS.IDraggingService>("dragging");
  }

  private getElementFactory(): BpmnJS.IElementFactory {
    return this.getModeler().get<BpmnJS.IElementFactory>("elementFactory");
  }

  private getModeling(): BpmnJS.IModelingService {
    return this.getModeler().get<BpmnJS.IModelingService>("modeling");
  }


  private raiseChanged(evt: any): void {
    this._changedListeners.forEach((c) => c(evt));
  }


  /**
   * Create new element at specific position
   */
  public createElement(options: ICreateElementOptions): void {

    const parent: BpmnJS.IRegistryElement = this._canvasService.getRootElement();
    const elementFactory: BpmnJS.IElementFactory = this.getElementFactory();
    const modeling: BpmnJS.IModelingService = this.getModeling();
    const shape: BpmnJS.IRegistryElement = elementFactory.createShape({ type: options.type });

    if (options.onCreating) {
      options.onCreating(shape);
    }

    modeling.createShape(
      shape,
      {
        x: options.x,
        y: options.y
      },
      parent
    );

  }

  /**
   * Create new element by drag and drop
   */
  public startElement(options: IStartElementOptions): void {

    const elementFactory: BpmnJS.IElementFactory = this.getElementFactory();
    const shape: BpmnJS.IRegistryElement =
      options.type === "ParticipantShape"
        ? elementFactory.createParticipantShape()
        : elementFactory.createShape({ type: options.type });

    const dragService: BpmnJS.IDraggingService = this.getDragging();

    if (options.onCreating) {
      options.onCreating(shape);
    }

    dragService.init(options.event, "create", {
      cursor: "grabbing",
      autoActivate: false, // if we use true, mpm drop throws error, ??
      threshold: 10,
      data: {
        shape: shape,
        context: {
          shape: shape,
          source: null
        }
      }
    });
  }

  /**
   * Update existing element with undo/redo support
   */
  public updateElement(options: IUpdateElementOptions): void {

    const modeling: BpmnJS.IModelingService = this.getModeling();
    const element: BpmnJS.IRegistryElement = options.element;
    const propertyName: string = options.propertyName;
    const propertyValue: any = options.propertyValue;

    // is resize,move?
    if (/^(x|y|width|height)$/.test(propertyName)) {

      if (propertyName === "x") {
        modeling.moveElements([element], { x: propertyValue - element.x, y: 0 });
      } else if (propertyName === "y") {
        modeling.moveElements([element], { x: 0, y: propertyValue - element.y });
      } else if (propertyName === "width" || propertyName === "height") {
        modeling.resizeShape(element, {
          x: element.x, y: element.y,
          width: parseInt((propertyName === "width" ? propertyValue : element.width), 0),
          height: parseInt((propertyName === "height" ? propertyValue : element.height), 0),
        });
      }

    } else {

      const property: any = {};
      property[propertyName] = propertyValue;

      if (/^(fill|stroke)$/.test(propertyName)) {
        modeling.setColor(element, property);
      } else {
        modeling.updateProperties(element, property);
      }

    }

  }

  /**
   * Hook to modeler changed event
   */
  public onChanged(callback: () => void): void {
    this._changedListeners.push(callback);
  }

}


angular
  .module("cremaPDE.processModeler")
  .service("modelingService", ModelingService)
  ;
