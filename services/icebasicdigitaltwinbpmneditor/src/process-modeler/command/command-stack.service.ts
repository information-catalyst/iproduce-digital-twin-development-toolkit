import * as angular from "angular";
import { IFactoryService, IManagerService } from "_core";

/**
 * Wrapper service over underlying BpmnJS Command Stack service, access to hook commands
 */
export interface ICommandStackService {

  /**
   * Returns true if the operations are allowed
   */
  areOperationsAllowed(): boolean;

  /**
   * Returns true if the undo operation can be made with the given modeler
   */
  canUndo(): boolean;

  /**
   * Returns true if the redo operation can be made with the given modeler
   */
  canRedo(): boolean;

  /**
   * Performs undo change operation in the given modeler
   */
  undoChanges(): void;

  /**
   * Returns true if the redo operation can be made with the given modeler
   */
  redoChanges(): void;


  /**
   * Hook to shape create command
   */
  onShapeCreate(callback: () => void): void;

  /**
   * Hook to shape create revert command
   */
  onShapeCreateRevert(callback: () => void): void;

  /**
   * Hook to elements delete command
   */
  onElementsDelete(callback: () => void): void;

  /**
   * Hook to elements delete revert command
   */
  onElementsDeleteRevert(callback: () => void): void;

}


/**
 * Wrapper service over underlying BpmnJS Command Stack service, gives access to undo/redo operations
 */
class CommandStackService implements ICommandStackService {

  static $inject = [
    "managerService",
    "factoryService",
  ];

  private _shapeCreateListeners: ((evt: any) => void)[];
  private _shapeCreateRevertListeners: ((evt: any) => void)[];
  private _elementsDeleteListeners: ((evt: any) => void)[];
  private _elementsDeleteRevertListeners: ((evt: any) => void)[];

  constructor(
    private _managerService: IManagerService,
    private _factoryService: IFactoryService,
  ) {

    this._shapeCreateListeners = [];
    this._shapeCreateRevertListeners = [];
    this._elementsDeleteListeners = [];
    this._elementsDeleteRevertListeners = [];

    this._factoryService.registerEvent("commandStack.shape.create.execute", this.raiseShapeCreate.bind(this), this, 500);
    this._factoryService.registerEvent("commandStack.shape.create.revert", this.raiseShapeCreateRevert.bind(this), this, 500);
    this._factoryService.registerEvent("commandStack.elements.delete.preExecute", this.raiseElementsDelete.bind(this), this, 500);
    this._factoryService.registerEvent("commandStack.elements.delete.revert", this.raiseElementsDeleteRevert.bind(this), this, 500);

  }


  private getModeler(): BpmnJS.IBaseModeler {
    return this._managerService.getModeler();
  }

  private hasModeler(): boolean {
    return this.getModeler() != null;
  }

  private isReadOnly(): boolean {
    return this._managerService.isReadOnly();
  }

  private getCommandStack(): BpmnJS.ICommandStackService {
    return this.getModeler().get<BpmnJS.ICommandStackService>("commandStack");
  }

  private checkReadOnly(): void {
    if (this.isReadOnly()) {
      throw new Error("Can't do undo/redo operations in readonly mode");
    }
  }


  private raiseShapeCreate(evt: any): void {
    this._shapeCreateListeners.forEach((c) => c(evt));
  }

  private raiseShapeCreateRevert(evt: any): void {
    this._shapeCreateRevertListeners.forEach((c) => c(evt));
  }

  private raiseElementsDelete(evt: any): void {
    this._elementsDeleteListeners.forEach((c) => c(evt));
  }

  private raiseElementsDeleteRevert(evt: any): void {
    this._elementsDeleteRevertListeners.forEach((c) => c(evt));
  }


  public areOperationsAllowed(): boolean {
    return this.getModeler() != null;
  }

  /**
   * Returns true if the undo operation can be made with the current modeler
   */
  public canUndo(): boolean {
    return this.isReadOnly() ? false : this.hasModeler() && this.getCommandStack().canUndo();
  }

  /**
   * Returns true if the redo operation can be made with the current modeler
   */
  public canRedo(): boolean {
    return this.isReadOnly() ? false : this.hasModeler() && this.getCommandStack().canRedo();
  }


  /**
   * Undoes the last edit operation.
   * If model is in readonly state, it throws an exception
   */
  public undoChanges(): void {
    this.checkReadOnly();
    this.getCommandStack().undo();
  }

  /**
   * Redoes the last undone operation.
   * If model is in readonly state, it throws an exception
   */
  public redoChanges(): void {
    this.checkReadOnly();
    this.getCommandStack().redo();
  }

  /**
   * Hook to shape create command
   */
  public onShapeCreate(callback: () => void): void {
    this._shapeCreateListeners.push(callback);
  }

  /**
   * Hook to shape create revert command
   */
  public onShapeCreateRevert(callback: () => void): void {
    this._shapeCreateRevertListeners.push(callback);
  }

  /**
   * Hook to shape create revert command
   */
  public onElementsDelete(callback: () => void): void {
    this._elementsDeleteListeners.push(callback);
  }

  /**
   * Hook to shape create revert command
   */
  public onElementsDeleteRevert(callback: () => void): void {
    this._elementsDeleteRevertListeners.push(callback);
  }


}


angular
  .module("cremaPDE.processModeler")
  .service("commandStackService", CommandStackService)
  ;
