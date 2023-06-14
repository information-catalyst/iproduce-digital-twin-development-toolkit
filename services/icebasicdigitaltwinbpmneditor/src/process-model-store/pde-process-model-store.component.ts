import * as angular from "angular";

import { IManagerService, IProcessModelDTO, IStoreService, IStoreEvent } from "_core";
import { IUrlParamService, ICustomizeService } from "../_common";

export interface IProcessModelStoreController {
  getProcesses(): void;
  openProcess(process: IProcessModelDTO): void;
  saveProcess(process: IProcessModelDTO): void;
  deleteProcess(process: IProcessModelDTO): void;
  close(): void;
  resetDetailView(): void;
}

export class ProcessModelStoreController {

  static $inject = [
    "$scope",
    "$element",
    "$sce",
    "$uibModal",
    "managerService",
    "storeService",
    "urlParamService",
    "customizeService"
  ];

  // list of processes from API
  private processes: IProcessModelDTO[];
  // show loading indicator
  public loading: boolean;
  // control expand of process-model-store window
  public expanded: boolean;
  // sortBy variable for table representation (table sort)
  public sortType: string;
  // sortReversed for table representation (table sort)
  public sortReverse: boolean;
  // show overlay div with process information
  public showProcessDetail: boolean;
  // process that was hovered the last time. will be presented in detailView
  public hoveredProcess: IProcessModelDTO;
  /**
   * holds the process that is actively selected by clicking on the its table row.
   * when a process is selected, it prevents the detail panel from vanishing on mouseleave
   */
  public selectedProcess: IProcessModelDTO;
  // detail panel is expanded / not expanded
  public panelExpanded: boolean;

  public ngShow: boolean;

  constructor(
    private $scope: ng.IScope,
    private $element: JQuery,
    private $sce: ng.ISCEService,
    private $uibModal: ng.ui.bootstrap.IModalService,
    private _managerService: IManagerService,
    private _storeService: IStoreService,
    private _urlParamService: IUrlParamService,
    private _customizeService: ICustomizeService,
  ) { }

  public $onInit(): void {

    this.panelExpanded = false;
    this.loading = false;
    this.expanded = false;
    this.sortType = "lastModified";
    this.sortReverse = true;
    this.showProcessDetail = false;

    // process manager notifies us after a process has been created or saved
    this._storeService.processSaved(() => {
      // refresh list of processes
      if (this.ngShow) {
        this.getProcesses();
      }
    });

    this.checkAndOpenProvidedProcess();

  }

  /**
   * Change to subscribe event after tools panel service is implemented
   */
  private updateDetailPanelRight(): void {
    // was not working
    // const width = this._customizeService.getValue("tools-panel.width");
    const width = angular.element(".tools-panel-container").width();
    this.$element.find(".processDetail").attr("style", `right: ${width || 500}px;`);
  }


  public checkAndOpenProvidedProcess(): void {
    let providedProcessId = null;
    providedProcessId = this._urlParamService.getProvidedProcessId();
    if (providedProcessId) {
      this._storeService
        .getAll()
        .then((processes) => {
          this.processes = processes;
          for (const process of processes) {
            if (providedProcessId === process._id) {
              this.openProcess(process);
              break;
            }
          }
        });
    }
  }


  public $onChanges(changes: any): void {
    if (changes.ngShow && changes.ngShow.currentValue === true) {
      this.getProcesses();
      this.updateDetailPanelRight();
    }
  }

  /**
   * resets detail view (reset selectedProcess, hide detailPanel)
   */
  public resetDetailView(): void {
    this.showProcessDetail = false;
    this.selectedProcess = null;
  }

  /**
   * select process for detail-panel
   * @param {IProcessModelDTO} process
   */
  public selectProcess(process: IProcessModelDTO): void {
    this.selectedProcess = process;
  }

  /**
   * opens a model to edit the process properties
   * calls updateProcess after edit (update process in CRI)
   * @param {IProcessModelDTO} process
   */
  public editProcess(process: IProcessModelDTO): void {
    this._storeService.addEditProcess(process);
  }

  /**
   * retrieve processes from CRI
   */
  public getProcesses(): void {
    this.loading = true;
    this._storeService
      .getAll()
      .then((processes: IProcessModelDTO[]) => {
        this.processes = processes;
        this.loading = false;
      });
  }

  /**
   * provide trustedSvg-string from process-model
   * @param  {IProcessModelDTO} process
   * @return {string}
   */
  public getTrustedSvg(process: IProcessModelDTO): string {
    if (process && process.bpmnSvg) {
      return this.$sce.trustAsHtml(process.bpmnSvg);
    }
  }

  /**
   * open process from CRI
   * @param {IProcessModelDTO} process
   */
  public openProcess(process: IProcessModelDTO): void {
    this.resetDetailView();
    // this.showProcessDetail = false;

    this._managerService.openModel(process);
  }

  /**
   * save process to CRI
   * @param {IProcessModelDTO} process
   */
  public saveProcess(process: IProcessModelDTO): void {
    this._storeService.saveProcess(process);
  }

  /**
   * delete process from CRI
   * @param {IProcessModelDTO} process
   */
  public deleteProcess(process: IProcessModelDTO): void {
    this._storeService
      .deleteProcess(process)
      .then(() => {

        this.resetDetailView();
        this.getProcesses();

        // notify process manager
        this._managerService.closeModel(process);

      }).catch(angular.noop);
  }

}

export class ProcessModelStoreComponent implements ng.IDirective {

  bindings = {
    ngShow: "<"
  };

  controller = ProcessModelStoreController;
  template = require("./pde-process-model-store.component.pug");

}

angular
  .module("cremaPDE.processModelStore")
  .component("pdeProcessModelStore", new ProcessModelStoreComponent())
  ;
