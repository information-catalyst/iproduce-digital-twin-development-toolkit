import * as angular from "angular";

import {
  IStatusPanelService,
  IStatusPanelButton
} from "../";

import { ICanvasService } from "process-modeler";


class StatusPanelController {

  static $inject = [
    "$timeout",
    "$element",
    "statusPanelService",
    "canvasService"
  ];

  constructor(
    private $timeout: ng.ITimeoutService,
    private $element: ng.IAugmentedJQuery,
    private _statusPanelService: IStatusPanelService,
    private _canvasService: ICanvasService
  ) {

    this._statusPanelService.onActivePanelChanged(this.onActivePanelChanged.bind(this));
  }

  private onActivePanelChanged(): void {

    const panel = this._statusPanelService.getActivePanel();
    if (panel) {
      this.$element.addClass("expanded");
    } else {
      this.$element.removeClass("expanded");
    }

    this.$timeout(() => this._canvasService.raiseResized(), 300);
  }

  public isActivePanel(panel: string): boolean {
    return this._statusPanelService.getActivePanel() === panel;
  }

  public getButtons(): IStatusPanelButton[] {
    return this._statusPanelService.getButtons();
  }

  public hasVisibleButtons(): boolean {
    return this.getButtons().filter((b) => b.isVisible()).length > 0;
  }

  public getPanels(): string[] {
    return this._statusPanelService.getPanels();
  }

}


class StatusPanelComponent implements ng.IDirective {

  controller = StatusPanelController;
  template = require("./pde-status-panel.component.pug");

}


angular
  .module("cremaPDE.statusPanel")
  .component("pdeStatusPanel", new StatusPanelComponent())
  ;
