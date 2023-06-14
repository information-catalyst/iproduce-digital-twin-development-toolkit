import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";
import { ISelectionService } from "../";


export enum AlignDirection {
  Top,
  Left,
  Right,
  Bottom,
  Center,
  Middle
}

export enum DistributeDirection {
  Horizontal,
  Vertical,
}


/**
 * This service takes care of aligning a group of selected elements
 */
export interface IAlignDistributeService {

  /**
   * Open align distribute popup
   */
  openAlignDistributePopup(): void;

  /**
   * Returns true if the align operation can be made with the given modeler
   */
  canAlignElements(): boolean;

  /**
   * Performs align operation in the given modeler, using the given direction
   */
  alignElements(direction: AlignDirection): void;

  /**
   * Returns true if the distribute operation can be made with the given modeler
   */
  canDistributeElements(): boolean;

  /**
   * Performs distribute operation in the given modeler, using the given direction
   */
  distributeElements(orientation: DistributeDirection): void;

}


/**
 * This service takes care of aligning / distributing a group of selected elements
 */
class AlignDistributeService implements IAlignDistributeService {

  static $inject = [
    "$uibModal",
    "managerService",
    "selectionService"
  ];

  private _alignDirections: string[];
  private _distributeDirections: string[];

  constructor(
    private $uibModal: angular.ui.bootstrap.IModalService,
    private _managerService: IManagerService,
    private _selectionService: ISelectionService
    ) {


      this._alignDirections = [
        "top", "left", "right", "bottom", "center", "middle"
      ];

      this._distributeDirections = [
        "horizontal", "vertical"
      ];

  }

  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  /**
   * Get access to underlying bpmnjs distribute service
   */
  private getDistribute(): BpmnJS.IDistributeService {
    return this.getModeler().get<BpmnJS.IDistributeService>("distributeElements");
  }


  /**
   * Get access to underlying bpmnjs align service
   */
  private getAlign(): BpmnJS.IAlignService {
    return this.getModeler().get<BpmnJS.IAlignService>("alignElements");
  }

  /**
   * Open align distribute popup
   */
  public openAlignDistributePopup(): void {
    this.$uibModal.open({
      component: "pdeAlignDistributePopup"
    }).result.catch(angular.noop);
  }


  /**
   * Returns true if the align operation can be made with the given modeler
   */
  public canAlignElements(): boolean {
    return !this._managerService.isReadOnly() && this._selectionService.get().length > 1;
  }

  /**
   * Performs align operation in the given modeler, using the given direction
   */
  public alignElements(direction: AlignDirection): void {

    // check selection
    const elements: BpmnJS.IRegistryElement[] = this._selectionService.get();
    if (!elements.length) {
      return;
    }

    this.getAlign().trigger(elements, this._alignDirections[direction]);
  }


  /**
   * Returns true if the distribute operation can be made with the given modeler
   */
  public canDistributeElements(): boolean {
    return !this._managerService.isReadOnly() && this._selectionService.get().length > 2;
  }

  /**
   * Performs distribute operation in the given modeler, using the given direction
   */
  public distributeElements(orientation: DistributeDirection): void {

    // check selection
    const elements: BpmnJS.IRegistryElement[] = this._selectionService.get();
    if (!elements.length) {
      return;
    }

    this.getDistribute().trigger(elements, this._distributeDirections[orientation]);
  }

}


angular
  .module("cremaPDE.processModeler")
  .service("alignDistributeService", AlignDistributeService)
  ;
