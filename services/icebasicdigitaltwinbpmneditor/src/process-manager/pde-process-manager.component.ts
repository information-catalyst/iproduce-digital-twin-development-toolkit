import * as angular from "angular";

import { IManagerService, IProcessModeler, IProcessModelDTO } from "_core";
import { IToolbarService, IToolbarButtonGroup } from "../toolbar";


class ProcessManagerController {

  static $inject = [
    "$element",
    "$timeout",
    "managerService"
  ];

  constructor(
    private $element: JQuery,
    private $timeout: ng.ITimeoutService,
    private _managerService: IManagerService
  ) {
  }


  /**
   * When component initializes, add new process by default
   */
  public $onInit(): void {
    this._managerService.addNewModel();
  }


  public getModels(): IProcessModelDTO[] {
    return this._managerService.getModels();
  }

  public selectModel(modelIndex: number): void {

    if (modelIndex !== this._managerService.getActiveIndex() && modelIndex >= 0) {

      this.$timeout(() => {

        const ul: JQuery = this.$element.find(".process-tabs-container ul");
        const el: JQuery = $(ul.children("li")[modelIndex]);

        // try to adjust margin so the tab becomes visible
        if (ul.length && el.length) {
          ul.attr("style", "margin-top:0");
          const ulPos: number = ul.position().top;
          const elPos: number = el.position().top;
          if (elPos !== ulPos) {
            const m: number = -(elPos - ulPos);
            if (m < 0) {
              ul.attr("style", "margin-top:" + m.toString() + "px");
            }
          }
        }

      }, 100);

    }

    // update selected
    this._managerService.selectByIndex(modelIndex);

  }


  public isActiveIndex(modelIndex: number): boolean {
    return this._managerService.getActiveIndex() === modelIndex;
  }

  public isReadOnly(modelIndex: number): boolean {
    return this._managerService.isReadOnly(modelIndex);
  }

  /*
   * Calculate process tab title based on whether it has unsaved changes or not
   */
  public getModelTitle(modelIndex: number): string {

    const model: IProcessModelDTO = this._managerService.getModel(modelIndex);
    return model.processName + (this._managerService.hasChanges(modelIndex) ? "(*)" : "");

  }


  public closeModel(modelIndex: number): void {
    this._managerService.closeModelByIndex(modelIndex);
  }


  public onModelerReady($event: any): void {
    this._managerService.modelerReady($event.modeler);
  }


  public onModelerError($event: any): void {
    this._managerService.closeModelByIndex(this.getModels().length - 1);
  }


}


class ProcessManagerComponent implements ng.IDirective {

  controller = ProcessManagerController;
  template = require("./pde-process-manager.component.pug");

}


// init component
angular
  .module("cremaPDE.processManager")
  .component("pdeProcessManager", new ProcessManagerComponent())
  ;
