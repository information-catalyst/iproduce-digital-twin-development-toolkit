import * as angular from "angular";

import {
  IFactoryService,
  IProcessModelDTO,
  IProcessModeler,
  IStoreService,
  IStoreEvent
} from "../";
import { IToolsPanelService } from "tools-panel";

export interface IManagerEvent {
  model: IProcessModelDTO;
  modeler: IProcessModeler;
}


export interface IManagerService {

  /**
   * Get active selected index
   */
  getActiveIndex(): number;

  /**
   * Get previous selected index
   */
  getPreviousIndex(): number;

  /**
   * Access to list of models
   */
  getModels(): IProcessModelDTO[];

  /**
   * Gets current model, or model at given index, returns null if outside bounds
   */
  getModel(index?: number): IProcessModelDTO;

  /**
   * Returns true if process at given index has pending changes, if omitted, returns true if current process has changes
   */
  hasChanges(index?: number): boolean;

  /**
   * Returns true if any process has pending changes
   */
  hasAnyChanges(): boolean;

  /**
   * Save model at given index or current model (if no index is provided)
   */
  saveChanges(index?: number): ng.IPromise<{}>;

  /**
   * Save an existing model with a new name
   */
  saveAs(): ng.IPromise<{}>;

  /*
   * Add new model
   */
  addNewModel(): void;

  /*
   * Open model from file or DTO
   */
  openModel(model: IProcessModelDTO): void;

  /*
   * Select model by index
   */
  selectByIndex(index: number): void;

  /*
   * Close given model
   */
  closeModel(model: IProcessModelDTO): void;

  /*
   * Close given model index
   */
  closeModelByIndex(tabIndex: number): void;

  /**
   * Returns true if model at given index or current model (if no index provided) is in readonly state
   */
  isReadOnly(index?: number): boolean;

  /**
   * Returns true if the current model is new
   */
  isNew(): boolean;

  /*
   * Subscribe for selected model/modeler event
   */
  onSelectedChanged(callback: () => void): void;

  /**
   * Subscribe for closed model/modeler event
   */
  onClosed(callback: (evt: IManagerEvent) => void): void;

  /*
   * Returns the current process modeler depending on the current tab selected
   */
  getModeler(index?: number): IProcessModeler;

  /**
   * Returns the list of all process modelers currently opened
   */
  getModelers(): IProcessModeler[];

  /*
   * When process modeler component is ready, add to the collection
   */
  modelerReady(modeler: IProcessModeler);

  /**
   * Subscribe when model is opened from process store
   */
  onOpened (callback: () => void): void ;

  /**
   * Subscrivbe whena new model is creaed
   */
  onNew (callback: () => void): void;


}


class ManagerService implements IManagerService {

  static $inject = [
    "$uibModal",
    "storeService",
    "factoryService"
  ];

  // list of process models
  private _models: IProcessModelDTO[];
  private _currentModel: IProcessModelDTO;
  private _changed: IProcessModelDTO[];

  // list of modelers
  private _modelers: IProcessModeler[];
  private _currentModeler: IProcessModeler;

  // variables for switching models
  private _prevIndex: number;
  private _activeIndex: number;

  private _selectedChangedListeners: (() => void)[];
  private _closedListeners: ((evt: IManagerEvent) => void)[];
  private _openedListeners: (() => void) [];
  private _newListeners: ( () => void ) [];

  constructor(
    private $uibModal: angular.ui.bootstrap.IModalService,
    private _storeService: IStoreService,
    private _factoryService: IFactoryService,
    private _toolsPanelService: IToolsPanelService
  ) {

    this._prevIndex = -1;
    this._activeIndex = -1;

    this._modelers = [];
    this._models = [];
    this._changed = [];

    this._storeService.processDeleted(this.onProcessDeleted.bind(this));
    this._factoryService.registerEvent("element.changed", this.markAsChanged.bind(this), this);

    this._selectedChangedListeners = [];
    this._closedListeners = [];
    this._openedListeners = [];
    this._newListeners = [];
  }

  /**
   * Mark current model as changed
   */
  private markAsChanged(): void {
    if (this._currentModel && this._changed.indexOf(this._currentModel) < 0) {
      this._changed.push(this._currentModel);
    }
  }


  /**
   * raise onOpend Listener
   */
  private raisedOpenedEvent (): void {
    this._openedListeners.forEach((cbk) => cbk() );
  }

  /**
   * Raise new event when createing a new model
   */
  private raiseNewEvent(): void {
    this._newListeners.forEach( (cbk) => cbk());
  }

  /**
   * Raise selected changed event
   */
  private raiseSelectedChangedEvent(): void {
    this._selectedChangedListeners.forEach( (cbk) => cbk());
  }

  /**
   * Raise selected changed event
   */
  private raiseClosedEvent(model: IProcessModelDTO, modeler: IProcessModeler): void {
    const evt = {
      model: model,
      modeler: modeler
    };
    this._closedListeners.forEach( (cbk) => cbk(evt));
  }

  /*
   * Returns model index with given ID
   */
  private getModelIndexById(id: string): number {

    if (!id) {
      return -1;
    }

    for (let i = 0; i < this._models.length; i++) {
      if (this._models[i]._id === id) {
        return i;
      }
    }

    return -1;
  }

  /*
   * Close process at given index without asking
   */
  private closeWithoutAsk(index: number): void {

    let model: IProcessModelDTO = null;
    let modeler: IProcessModeler = null;

    // remove model from collection, ensure inside bounds
    if (index >= 0 && index < this._models.length) {
      model = this._models[index];
      this._models.splice(index, 1);
    }

    // remove ref to modeler
    if (index >= 0 && index < this._modelers.length) {
      modeler = this._modelers[index];
      this._modelers.splice(index, 1);
    }

    this.raiseClosedEvent(model, modeler);

    // assign new activeIndex
    if (index === this._activeIndex) {

      const temp: number = index > 0 ? index - 1 : index + 1;
      const newIndex: number = temp < this._models.length ? temp : this._models.length > 0 ? 0 : -1;
      this.selectByIndex(newIndex);

    } else if (index < this._activeIndex) {
      this.selectByIndex(this._activeIndex - 1);
    }

  }

  /**
   * When a process is deleted from store, check if it's open, and close it
   */
  private onProcessDeleted(eventData: IStoreEvent): void {
    const index = this.getModelIndexById(eventData.model._id);
    if (index >= 0) {
      this.closeWithoutAsk(index);
    }
  }

  /**
   * Add model to list of models with pending changes
   */
  private onProcessChanged(): void {
    const model = this.getModel();
    if (model && this._changed.indexOf(model) < 0) {
      this._changed.push(model);
    }
  }


  /**
   * Get active selected index
   */
  public getActiveIndex(): number {
    return this._activeIndex;
  }

  /**
   * Get previous selected index
   */
  public getPreviousIndex(): number {
    return this._prevIndex;
  }

  /*
   * Returns model at given index
   */
  public getModel(index?: number): IProcessModelDTO {

    if (index == null) {
      index = this._activeIndex;
    }

    if (index < 0 || index >= this._models.length) {
      return null;
    }

    return this._models[index];
  }

  /**
   * Access to list of models
   */
  public getModels(): IProcessModelDTO[] {
    return this._models;
  }

  /*
   * Select by index
   */
  public selectByIndex(index: number): void {

    const prevIndex = this._activeIndex;
    this._activeIndex = index;

    if (this._currentModeler) {
      this._currentModeler.setActive(false);
    }

    this._currentModeler = index >= 0 && index < this._modelers.length ? this._modelers[index] : null;
    this._currentModel = index >= 0 && index < this._models.length ? this._models[index] : null;

    if (this._currentModeler) {
      this._currentModeler.setActive(true);
    }

    // raise event when there is a modeler, or if no models at all
    if (this._currentModeler || !this._currentModel) {
      this.raiseSelectedChangedEvent();
    }

  }

  /*
   * Returns process modeler component at given index
   */
  public getModelerByIndex(index: number): IProcessModeler {

    if (index < 0 || index >= this._modelers.length) {
      return null;
    }
    return this._modelers[index];
  }

  /*
   * Returns the current process modeler depending on the current tab selected
   */
  public getModeler(index?: number): IProcessModeler {
    return index == null ? this._currentModeler : this.getModelerByIndex(index);
  }

  /**
   * Returns the list of all process modelers currently opened
   */
  public getModelers(): IProcessModeler[] {
    return this._modelers;
  }

  /**
   * Returns true if process at given index has pending changes, if omitted, returns true if current process has changes
   */
  public hasChanges(index?: number): boolean {

    const model = this.getModel(index);
    return this._changed.indexOf(model) >= 0;

  }

  /**
   * Returns true if any process has pending changes
   */
  public hasAnyChanges(): boolean {
    return this._changed.length > 0;
  }

  /**
   * Save model at given index or current model (if no index is provided)
   */
  public saveChanges(index?: number): ng.IPromise<any> {

    const modeler = this.getModeler();
    const model = this.getModel();

    return modeler.getXML().then((xml: string) => {

      model.bpmnXml = xml;

      return modeler.getSVG().then((svg: string) => {

        model.bpmnSvg = svg;
        return this._storeService.saveProcess(model).then(() => {
          const idx = this._changed.indexOf(this._currentModel);
          this._changed.splice(idx, 1);
        });

      });

    });
  }


  /**
   * Save model with a new name and _id
   */
  public saveAs (): ng.IPromise<any> {

        const modeler = this.getModeler();
        const model = this.getModel();

        return modeler.getXML().then((xml: string) => {

          model.bpmnXml = xml;

          return modeler.getSVG().then((svg: string) => {

            // https://toddmotto.com/a-better-way-to-scope-angular-extend-no-more-vm-this/
            angular.extend(model, {bpmnSvg: svg, processServicePlanId: null, _id: null });
            return this._storeService.saveProcess(model);

          });

        });

      }


  /*
   * When process modeler component is ready, add to the collection
   */
  public modelerReady(modeler: IProcessModeler): void {

    // TODO : Attach to modeler event changed

    // modeler is ready
    this._modelers.push(modeler);

    // update current modeler
    this._currentModeler = modeler;

    // now it's time to change current index
    this.selectByIndex(this._modelers.length - 1);

  }

  /*
   * Add new process
   */
  public addNewModel(): void {

    // create model, this will trigger new process modeler component
    this.openModel(<any>{});
  }

  /*
   * Open model from file or DTO
   */
  public openModel(model: IProcessModelDTO): void {

    // if the process is already opened, just switch to it
    const index: number = this.getModelIndexById(model._id);
    if (index >= 0) {

      this.selectByIndex(index);

    } else {

      if (!model.processName) {
        model.processName = "New";
      }

      // add model
      this._models.push(model);
    }

    this.raisedOpenedEvent ();
    this.raiseNewEvent ();

  }

  /*
   * Close given process model
   */
  public closeModel(model: IProcessModelDTO): void {
    const idx = this.getModels().indexOf(model);
    if (idx > -1) {
      this.closeModelByIndex(idx);
    }
  }

  /*
   * Close given process tab
   */
  public closeModelByIndex(index: number): void {

    const modeler: IProcessModeler = this.getModelerByIndex(index);

    // process can be null, as result of calling this from modeler after a open error
    if (modeler && this.hasChanges(index)) {

      this.$uibModal.open({
        component: "pdeSaveChangesPopup",
        size: "xs"
      })
        .result
        .then((confirmed: boolean) => {

          if (confirmed) {
            return this.saveChanges();
          }

        })
        .then(() => { this.closeWithoutAsk(index); })
        .catch(angular.noop);

    } else {

      this.closeWithoutAsk(index);

    }

  }


  public isNew(): boolean {
    const model = this.getModel();
    return model && !model.lastModified ? true : false;
  }

  /**
   * Returns true if model at given index or current model (if no index provided) is in readonly state
   */
  public isReadOnly(index?: number): boolean {
    const model = this.getModel(index);
    return model && model.processServicePlanId ? true : false;
  }

  /*
   * Subscribe for selected model/modeler event
   */
  public onSelectedChanged(callback: () => void): void {
    this._selectedChangedListeners.push(callback);
  }

  /**
   * Subscribe for closed model/modeler event
   */
  public onClosed(callback: (evt: IManagerEvent) => void): void {
    this._closedListeners.push(callback);
  }

  /**
   * Subscribe for open model event
   */
  public onOpened (callback: () => void): void {
    this._openedListeners.push(callback);
  }

  /**
   * Subscribe for onNew model event
   */

  public onNew (callback: () => void): void {
    this._newListeners.push( callback);
  }


}


// init component
angular
  .module("cremaPDE.core")
  .service("managerService", ManagerService)
  ;
