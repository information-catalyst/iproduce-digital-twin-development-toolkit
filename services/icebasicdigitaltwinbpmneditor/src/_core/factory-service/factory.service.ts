import * as angular from "angular";

// we use this class to wrap BpmnJS.BpmnModeler instance
import BpmnModeler = require("BpmnModeler");
import BpmnNavigatedViewer = require("BpmnNavigatedViewer");

import { IImportResult } from "_core";

const BPMN_NEW_DIAGRAM = require("./initial.bpmn");

/**
 * Interface for describing a process modeler internal event
 */
export interface IModelerEvent {
  eventName: string;
  priority: number;
  caller: any;
  callback: (params?: any[]) => void;
}


export interface IFactoryService {

  /**
   * Constructs new BpmnJS modeler instance, using registered moddle extensions and modules
   */
  createModeler(container: JQuery | string, readonly: boolean, xml: string): ng.IPromise<BpmnJS.IBpmnModeler>;

  /**
   * Register new moddle extension to be added to each new modeler
   */
  registerModdleExtension(name: string, contents: any): void;

  /**
   * Register new additional module to be added to each new modeler
   */
  registerModule(additionalModule: any): void;

  /**
   * Register for modeler event. All new modelers will have this event attached
   */
  registerEvent(eventName: string, callback: () => void, caller: any, priority?: number): void;

  /**
   * Register for import warnings event
   */
  onImportWarning(callback: (result: IImportResult[]) => void): void;

}


class FactoryService implements IFactoryService {

  static $inject = [
    "$q",
    "$rootScope",
  ];

  private _moddleExtensions: any;
  private _additionalModules: any[];
  private _registeredEvents: IModelerEvent[];
  private _importWarningListeners: ((result: IImportResult[]) => void)[];

  constructor(
    private $q: ng.IQService,
    private $rootScope: ng.IRootScopeService
  ) {
    this._moddleExtensions = {};
    this._additionalModules = [];
    this._registeredEvents = [];
    this._importWarningListeners = [];
  }

  private createReadonlyModeler(options: any): BpmnJS.IBpmnModeler {
    return new BpmnNavigatedViewer(options);
  }


  private createWritableModeler(options: any): BpmnJS.IBpmnModeler {
    return new BpmnModeler(options);
  }

  private raiseImportWarningEvent(result: IImportResult[]): void {
    this._importWarningListeners.forEach((c) => c(result));
  }

  /**
   * Constructs new BpmnJS modeler instance, using registered moddle extensions and modules
   */
  public createModeler(container: JQuery | string, readonly: boolean, xml: string): ng.IPromise<BpmnJS.IBpmnModeler> {

    return this.$q((resolve, reject) => {

      const options = {
        container: container,
        moddleExtensions: this._moddleExtensions,
        additionalModules: this._additionalModules
      };

      const modeler = readonly ? this.createReadonlyModeler(options) : this.createWritableModeler(options);

      modeler.importXML(xml || BPMN_NEW_DIAGRAM, (err, results: any[]) => {

        const eventBus = modeler.get<BpmnJS.IEventBusService>("eventBus");
        this._registeredEvents.forEach((e) => {

          eventBus.on(e.eventName, e.priority, (evt) => {
            this.$rootScope.$applyAsync(() => e.callback(evt));
          }, e.caller);

        });

        this.raiseImportWarningEvent(results);

        this.$rootScope.$broadcast("MODELER_READY");

        return err ? reject(err) : resolve(modeler);

      });


    });

  }


  /**
   * Register new moddle extension to be added to each new modeler
   */
  public registerModdleExtension(name: string, contents: any): void {

    if (!name || !name.length) {
      throw new Error("Moddle extension name is required");
    }

    if (!contents) {
      throw new Error("Moddle extension contents are required");
    }

    if (this._moddleExtensions[name]) {
      throw new Error("A Moddle extension with the same name was already added");
    }

    this._moddleExtensions[name] = contents;

  }

  /**
   * Register new additional module to be added to each new modeler
   */
  public registerModule(additionalModule: any): void {

    if (!additionalModule) {
      throw new Error("Additional module cannot be null");
    }

    this._additionalModules.push(additionalModule);
  }


  /**
   * Register for modeler event. All new modelers will have this event attached
   */
  public registerEvent(eventName: string, callback: () => void, caller: any, priority?: number): void {

    this._registeredEvents.push({
      eventName: eventName,
      priority: priority || 500,
      callback: callback,
      caller: caller
    });

  }

  /**
   * Register for import warnings event
   */
  public onImportWarning(callback: (result: IImportResult[]) => void): void {
    this._importWarningListeners.push(callback);
  }


}


angular
  .module("cremaPDE.core")
  .service("factoryService", FactoryService)
  ;
