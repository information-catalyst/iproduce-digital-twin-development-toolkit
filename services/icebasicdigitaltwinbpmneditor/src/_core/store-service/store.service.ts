import * as angular from "angular";

import { IUtilService, CriService, ICriService, IAppConfig, IMsgBoxService } from "../../_common";
import { IProcessModelDTO } from "./";


export interface IStoreEvent {
  model: IProcessModelDTO;
}


export interface IStoreService extends ICriService<IProcessModelDTO> {

  /**
   * Open edit process popup for changing process model properties and updates the model in CRI
   */
  addEditProcess(process: IProcessModelDTO): ng.IPromise<{}>;

  /**
   * Save process changes
   */
  saveProcess(process: IProcessModelDTO): ng.IPromise<{}>;

  /**
   * Delete process from CRI
   */
  deleteProcess(process: IProcessModelDTO): ng.IPromise<{}>;

  /*
   * Subscribe for process saved event
   */
  processSaved(cbk: (evt: IStoreEvent) => void): void;

  /*
   * Subscribe for process deleted event
   */
  processDeleted(cbk: (evt: IStoreEvent) => void): void;

}

export class StoreService extends CriService<IProcessModelDTO> implements IStoreService {

  static $inject = [
    "$q",
    "$uibModal",
    "msgBoxService",
    "utilService",
    "CONFIG"
  ];

  private _processSavedListeners: ((eventData: IStoreEvent) => void)[];
  private _processDeletedListeners: ((eventData: IStoreEvent) => void)[];


  constructor(
    private $q: ng.IQService,
    private $uibModal: angular.ui.bootstrap.IModalService,
    private _msgboxService: IMsgBoxService,
    utilService: IUtilService,
    APPCONFIG: IAppConfig
  ) {

    super(utilService, APPCONFIG);

    this._processSavedListeners = [];
    this._processDeletedListeners = [];
  }




  /**
   * Raise process saved event
   */
  private raiseProcessSavedEvent(model: IProcessModelDTO): void {
    this._processSavedListeners.forEach( (cbk) => {
      cbk({ model: model });
    });
  }


  /**
   * Raise process deleted event
   */
  private raiseProcessDeletedEvent(model: IProcessModelDTO): void {
    this._processDeletedListeners.forEach( (cbk) => {
      cbk({ model: model });
    });
  }

  private isSaveAsProcess (process: IProcessModelDTO): boolean {
    return process._id == null && process.lastModified != null ? true : false;
  }

  private isNewProcess(process: IProcessModelDTO): boolean {
    return process._id ? false : true;
  }


  public getBucketName(): string {
    return "processModels";
  }

  public getOrganizationName(): string {
    return "crema";
  }

  public getApplicationName(): string {
    return "main";
  }

  public getOwnerName(): string {
    return "pde";
  }


  /**
   * creates a new process in CRI
   * @param  {IProcessModelDTO} process
   * @return {ng.IPromise}              [description]
   */
  private createProcess(process: IProcessModelDTO): ng.IPromise<any> {

    process.lastModified = new Date();
    return this.create(process)
    .then((id: string) => {
      this._msgboxService.showSuccess("New Process Model stored successfully (ID: " + id + ")");
      this.raiseProcessSavedEvent(process);
    })
    .catch(() => {
      throw new Error("New Process Model save failed");
    });

  }

  /**
   * updates existing process in CRI
   * @param  {IProcessModelDTO} process [description]
   * @return {ng.IPromise}              [description]
   */
  private updateProcess(process: IProcessModelDTO): ng.IPromise<any> {

    process.lastModified = new Date();
    return this.update(process)
    .then(() => {
      this._msgboxService.showSuccess("Process Model updated successfully");
      this.raiseProcessSavedEvent(process);
    })
    .catch(() => {
      throw new Error("Process Model update failed");
    });

  }

  /**
   * Open edit process popup for changing process model properties and updates the model in CRI
   */
  public addEditProcess(process: IProcessModelDTO): ng.IPromise<{}> {

    return this.$uibModal.open({
      component: "pdeEditProcessPopup",
      size: "md",
      resolve: {
        isNew: () => this.isNewProcess(process),
        process: () => process
      }
    })
    .result.then((result: IProcessModelDTO) => {

      // copy new properties and ensure lastModified is set
      angular.extend(process, result);
      return this.isNewProcess(process) || this.isSaveAsProcess(process) ? this.createProcess(process) : this.updateProcess(process);

    }).catch(angular.noop)
    ;

  }

  /**
   * save a process in CRI, abstraction of create/update.
   * Decides automatically if a model needs to be updated or created
   * @param  {IProcessModelDTO} process
   * @return {ng.IPromise}
   */
  public saveProcess(process: IProcessModelDTO): ng.IPromise<{}> {

    // if new process or save as a new process, open popup for asking user required values
    if (this.isNewProcess(process) || this.isSaveAsProcess (process)) {
      return this.addEditProcess(process);
    } else {
      // if existing process model, call update
      return this.updateProcess(process);
    }
  }

  /**
   * deletes a process in CRI
   * @param  {IProcessModelDTO}     process [description]
   * @return {ng.IPromise<boolean>}         [description]
   */
  public deleteProcess(process: IProcessModelDTO): ng.IPromise<{}> {

    // open confirm delete process modal dialog
    return this.$uibModal.open({
      component: "pdeDeleteProcessPopup",
      resolve: {
        process: () => process
      },
      size: "xs"
    })
    .result.then(() => {

      // if user answer is yes (wants to delete process)
      return this.delete(process)
      .then(() => {

        this._msgboxService.showSuccess("Process " + process.processName + " deleted successfully.");
        this.raiseProcessDeletedEvent(process);
        return 1;

      });

    });

  }

  /*
   * Subscribe for process saved event
   */
  public processSaved(cbk: (evt: IStoreEvent) => void): void {
    this._processSavedListeners.push(cbk);
  }

  /*
   * Subscribe for process deleted event
   */
  public processDeleted(cbk: (evt: IStoreEvent) => void): void {
    this._processDeletedListeners.push(cbk);
  }

}

angular
.module("cremaPDE.core")
.service("storeService", StoreService)
;
