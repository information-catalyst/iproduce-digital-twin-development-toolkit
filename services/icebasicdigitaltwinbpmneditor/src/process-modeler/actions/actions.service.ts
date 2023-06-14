import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";

// we use this service to select/unselect elements in process diagram, and add selection change listeners
export interface IActionsService {

  /**
   * Returns true if operations are allowed
   */
  areOperationsAllowed(): boolean;

  activateHandTool(event: Event): void;
  isHandToolActive(): boolean;

  activateLassoTool(event: Event): void;
  isLassoToolActive(): boolean;

  activateSpaceTool(event: Event): void;
  isSpaceToolActive(): boolean;

  activateConnectionTool(event: Event): void;
  isConnectionToolActive(): boolean;

  activateDeleteTool(event: Event): void;
  isDeleteToolActive(): boolean;

  /**
   * Show/Hide search pad in the current modeler
   */
  toggleSearchPad(): void;
}


class ActionsService implements IActionsService {

  static $inject = [
    "$timeout",
    "managerService"
  ];

  constructor(
    private $timeout: ng.ITimeoutService,
    private _managerService: IManagerService,
  ) {}

  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  public areOperationsAllowed(): boolean {
    return this.getModeler() != null;
  }

  private getActions(): BpmnJS.IEditorActionsService {
    return this.getModeler().get<BpmnJS.IEditorActionsService>("editorActions");
  }

  private getHandTool(): BpmnJS.IHandTool {
    return this.getModeler().get<BpmnJS.IHandTool>("handTool");
  }

  private getLassoTool(): BpmnJS.ILassoTool {
    return this.getModeler().get<BpmnJS.ILassoTool>("lassoTool");
  }

  private getSpaceTool(): BpmnJS.ISpaceTool {
    return this.getModeler().get<BpmnJS.ISpaceTool>("spaceTool");
  }

  private getGlobalConnect(): BpmnJS.IGlobalConnect {
    return this.getModeler().get<BpmnJS.IGlobalConnect>("globalConnect");
  }

  private getGlobalDelete(): any {
    return this.getModeler().get<any>("globalDelete");
  }

  private getSearchPad(): BpmnJS.ISearchPadService {
    return this.getModeler().get<BpmnJS.ISearchPadService>("searchPad");
  }

  private validateNotNull(obj: any, message: string): void {
    if (obj == null) {
      throw "ActionsService." + message;
    }
  }

  /**
   * Toggle show/hide search pad
   */
  public toggleSearchPad(): void {
    this.$timeout(() => {
      this.getSearchPad().toggle();
    }, 10);
  }



  public activateHandTool(event: Event): void {
    this.getHandTool().activateHand(event);
  }

  public isHandToolActive(): boolean {
    return this.getHandTool().isActive() ? true : false;
  }

  public activateLassoTool(event: Event): void {
    this.getLassoTool().activateSelection(event);
  }

  public isLassoToolActive(): boolean {
    return this.getLassoTool().isActive() ? true : false;
  }

  public activateSpaceTool(event: Event): void {
    this.getSpaceTool().activateSelection(event);
  }

  public isSpaceToolActive(): boolean {
    return this.getSpaceTool().isActive() ? true : false;
  }

  public activateConnectionTool(event: Event): void {
    this.getGlobalConnect().toggle();
  }

  public isConnectionToolActive(): boolean {
    return this.getGlobalConnect().isActive() ? true : false;
  }

  public activateDeleteTool(event: Event): void {
    this.getGlobalDelete().toggle();
  }

  public isDeleteToolActive(): boolean {
    return this.getGlobalDelete().isActive() ? true : false;
  }

}


angular
  .module("cremaPDE.processModeler")
  .service("actionsService", ActionsService)
  ;
