import * as angular from "angular";

import {
  IManagerService,
  IProcessModeler,
  IProcessModelDTO
} from "_core";
import { ISimulationService } from "../../simulation/simulation.service";


export interface IExportService {

  canExport(): boolean;
  exportToFile(fileName?: string): ng.IPromise<void>;
  exportToSVG(fileName?: string): ng.IPromise<void>;
  exportToLog(): void;

}


class ExportService implements IExportService {

  static $inject = [
    "managerService",
    "FileSaver",
    "Blob",
    "simulationService"
  ];

  constructor(
    private _managerService: IManagerService,
    private FileSaver: angular.FileSaver,
    private Blob: any,
    private _simulationService: ISimulationService
  ) {
  }


  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  private ensureModeler(): IProcessModeler {
    const modeler = this.getModeler();
    if (!modeler) {
      throw new Error("ExportService. No modeler available");
    }
    return modeler;
  }

  private ensureModel(): IProcessModelDTO {
    const model = this._managerService.getModel();
    if (!model) {
      throw new Error("ExportService. No model available");
    }
    return model;
  }

  private saveFile(fileName: string, contents: string, contentType: string): void {
    const data: any = new this.Blob([contents], { type: contentType });
    this.FileSaver.saveAs(data, fileName);
  }

  /**
   * Returns true if export operations are allowed
   */
  public canExport(): boolean {
    return this.getModeler() != null ? true : false;
  }


  public exportToFile(fileName?: string): ng.IPromise<void> {

    const modeler = this.ensureModeler();
    const model = this._managerService.getModel();

    return modeler.getXML().then((xml: string) => {
      const fileName = model.processName || "diagram";
      this.saveFile(`${fileName}.bpmn`, xml, "application/bpmn20-xml;charset=utf-8");
    });

  }


  // export current process to SVG
  public exportToSVG(): ng.IPromise<void> {

    const modeler = this.ensureModeler();
    const model = this._managerService.getModel();

    return modeler.getSVG().then((svg: string) => {

      const fileName = model.processName || "diagram";
      this.saveFile(`${fileName}.svg`, svg, "image/svg+xml;charset=utf-8");

    });

  }

  public exportToLog(): void {
    let str = JSON.stringify(this._simulationService.getFinishedTasks());
    str = str.substr (1, str.length - 2 );
    this.saveFile(`${this._managerService.getModel().processName}.log`, str, "text/plain;charset=utf-8");
  }

}


angular
  .module("cremaPDE.processModeler")
  .service("exportService", ExportService)
  ;
