import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";
import { ISelectionService } from "../";

/**
 * Wrapper service over underlying BpmnJS CopyPaste service, gives access to copy/paste operations
 */
export interface ICopyPasteService {

  /**
   * Returns true if operations are allowed
   */
  areOperationsAllowed(): boolean;

  /**
   * Returns true if the copy operation can be made
   */
  canCopy(): boolean;

  /**
   * Returns true if the paste operation can be made
   */
  canPaste(): boolean;

  /**
   * Performs copy to clipboard operation
   */
  copy(): void;

  /**
   * Performs paste from clipboard operation
   */
  paste(): void;

}


/**
 * Wrapper service over underlying BpmnJS CopyPaste service, gives access to copy/paste operations
 */
class CopyPasteService implements ICopyPasteService {

  static $inject = [
    "managerService",
    "selectionService",
  ];

  constructor(
    private _managerService: IManagerService,
    private _selectionService: ISelectionService,
  ) {

  }

  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  /**
   * Get access to underlying copy paste service
   */
  private getCopyPaste(): BpmnJS.ICopyPasteService {
    return this.getModeler().get<BpmnJS.ICopyPasteService>("copyPaste");
  }

  /**
   * Get access to underlying clipboard service
   */
  private getClipboard(): BpmnJS.IClipboardService {
    return this.getModeler().get<BpmnJS.IClipboardService>("clipboard");
  }

  /**
   * Get access to underlying mouse tracking service
   */
  private getMouseTracking(): BpmnJS.IMouseTrackingService {
    return this.getModeler().get<BpmnJS.IMouseTrackingService>("mouseTracking");
  }

  /**
   * Returns true if operations are allowed
   */
  public areOperationsAllowed(): boolean {
    return this.getModeler() != null;
  }

  /**
   * Returns true if the copy operation can be made with the given modeler
   */
  public canCopy(): boolean {
    return this.getModeler() && !this._managerService.isReadOnly() && this._selectionService.get().length > 0;
  }

  /**
   * Returns true if the paste operation can be made with the given modeler
   */
  public canPaste(): boolean {
    return this.getModeler() && !this._managerService.isReadOnly() && !this.getClipboard().isEmpty();
  }

  /**
   * Performs copy to clipboard operation in the given modeler
   */
  public copy(): void {
    this.getCopyPaste().copy(this._selectionService.get());
  }

  /**
   * Performs paste from clipboard operation in the given modeler
   */
  public paste(): void {
    this.getCopyPaste().paste(this.getMouseTracking().getHoverContext());
  }

}


angular
  .module("cremaPDE.processModeler")
  .service("copyPasteService", CopyPasteService)
  ;
