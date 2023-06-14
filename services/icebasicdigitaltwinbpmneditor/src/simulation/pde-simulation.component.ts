import * as angular from "angular";

import { IProcessModeler } from "_core";

import { IToolbarService } from "toolbar";
import {
  ISimulationService,
  ISimulationThread,
  IThreadChoice,
  SimulationState,
  SimulationThreadState,
  IFinishedTask
} from "./simulation.service";
import { IExportService } from "../process-modeler/save-export/export.service";


class SimulationController {

  static $inject = [
    "$element",
    "simulationService",
    "toolbarService",
    "exportService"
  ];

  constructor(
    private $element: ng.IAugmentedJQuery,
    private _service: ISimulationService,
    private _toolbarService: IToolbarService,
    private _exportService: IExportService
  ) {

    this._toolbarService.addButtonGroup({
      isVisible: () => this._service.canSimulate(),
      key: "simulation",
      buttons: [{
        getIcon: () => "fa-play",
        clickAction: this.toggleCollapsed.bind(this),
      }]
    });

  }


  private toggleCollapsed(section: string): void {
    this.$element.toggleClass("visible");
  }



  public getThreads(): ISimulationThread[] {
    return this._service.getThreads();
  }


  public getThreadPositionName(thread: ISimulationThread): string {
    return thread.element.name;
  }


  public getThreadStatusName(thread: ISimulationThread): string {
    switch (thread.status) {
      case SimulationThreadState.Running:
        return "Running";
      case SimulationThreadState.Waiting:
        return "Waiting";
      case SimulationThreadState.Finished:
        return "Finished";
    }
  }


  public toggleFollowThread(thread: ISimulationThread): void {
    this._service.toggleFollowThread(thread);
  }


  public isSimulating(): boolean {
    return this._service.isSimulating();
  }


  public hasWaitingThreads(): boolean {
    return this._service.hasWaitingThreads();
  }

  public getWaitingThreads(): ISimulationThread[] {
    return this._service.getWaitingThreads();
  }

  public getWaitingThreadChoices(): IThreadChoice[] {
    return this._service.getWaitingThreadChoices();
  }

  public setThreadChoice(choice: IThreadChoice): void {
    this._service.setThreadChoice(choice);
  }

  public getFinishedTasks (): IFinishedTask [] {
    return this._service.getFinishedTasks();
  }

  public clearFinishedTasks (): void {
    this._service.clearFinishedTasks ();
  }

  public toggleSimulation(): void {
    this._service.toggleSimulation();
  }

  public exportToLog(): void {
    this._exportService.exportToLog();
  }


}


class SimulationComponent implements ng.IDirective {
  controller = SimulationController;
  template = require("./pde-simulation.component.pug");
}



angular
  .module("cremaPDE.simulation")
  .component("pdeSimulation", new SimulationComponent())
  ;
