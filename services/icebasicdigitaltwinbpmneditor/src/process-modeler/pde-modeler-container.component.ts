import * as angular from "angular";

import { IFactoryService, IProcessModeler, IProcessModelDTO, IStoreService } from "_core";

enum ModelerView {
  Design,
  Xml
}

const CSS_CANVAS_PANEL = "canvas-panel";
const CSS_XML_PANEL = "xml-panel";


// main wrapper class for BPMNJS Modeler
class ProcessModelerController implements IProcessModeler {


  // inject AngularJS dependencies
  static $inject = [
    "$element",
    "$q",
    "factoryService"
  ];

  private _id: string;

  // we hold reference to Bpmn Modeler
  private _modeler: BpmnJS.IBpmnModeler;

  private _busy: boolean;

  // switch from Design View / Xml View
  private _viewMode: ModelerView;

  // dictionary of listeners
  private _viewChangedListeners: (() => void)[];


  // current ProcessModelDTO
  public model: IProcessModelDTO;
  public readOnly: boolean;

  public ready: (eventData: any) => void;
  public error: (eventData: any) => void;


  // component constructor, initialize things
  constructor(
    private $element: JQuery,
    private $q: ng.IQService,
    private _factoryService: IFactoryService,
  ) {

    this._busy = true;
    this._viewMode = ModelerView.Design;
    this._viewChangedListeners = [];

    this.generateId();
  }

  /**
   * Generate unique modeler ID
   */
  private generateId(): void {
    this._id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r: number = Math.random() * 16 | 0, v: any = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  /**
   * When component has been initialized, initialize modeler
   */
  public $onInit(): void {

    // init modeler
    // construct blank Bpmn Modeler
    this._factoryService.createModeler(
      this.$element.find("." + CSS_CANVAS_PANEL),
      this.readOnly,
      this.model.bpmnXml
    )
    .then((modeler) => {

      this._modeler = modeler;

      // notify ready event
      this.ready({ $event: { modeler: this }});

    })
    .catch((err) => {

      // notify error event
      this.error({ $event: { model: this.model }});
      throw new Error(err);
    })
    .finally(() => {
      this._busy = false;
    })
    ;

  }


  /**
   * Gets process modeler unique identifier
   */
  public getId(): string {
    return this._id;
  }


  public setActive(value: boolean): void {
    value === true ? this.$element.css("display", "flex") : this.$element.css("display", "none");
  }


  public isReadOnly(): boolean {
    return this.readOnly;
  }

  public isBusy(): boolean {
    return this._busy;
  }


  // get access to underlying BPMN IO services
  public get<T>(serviceId: string): T {
    return this._modeler && this._modeler.get<T>(serviceId) || null;
  }

  /**
   * Get svg data content
   */
  public getSVG(): ng.IPromise<string> {

    return this.$q((resolve, reject) => {
      this._modeler.saveSVG((err: string, svg: string) => {
        return err ? reject(err) : resolve(svg);
      });
    });

  }

  /**
   * Get xml data content
   */
  public getXML(): ng.IPromise<string> {

    return this.$q((resolve, reject) => {
      this._modeler.saveXML({ format: true, preamble: true }, (err: string, xml: string) => {
        return err ? reject(err) : resolve(xml);
      });
    });

  }


  private raiseViewChangedEvent(): void {
    this._viewChangedListeners.forEach((l) => l());
  }

  public isDesignView(): boolean {
    return this._viewMode === ModelerView.Design;
  }

  public isXmlView(): boolean {
    return this._viewMode === ModelerView.Xml;
  }

  public setDesignView(): void {
    this._viewMode = ModelerView.Design;
    this.raiseViewChangedEvent();
  }

  public setXmlView(): void {

    // update xml
    this.getXML().then((xml: string) => {

      this.model.bpmnXml = xml;
      this._viewMode = ModelerView.Xml;
      this.raiseViewChangedEvent();
    });

  }

  /**
   * Attach to xml/design view changed event
   */
  public onViewChanged(callback: () => void): void {
    this._viewChangedListeners.push(callback);
  }

  // destroy modeler
  public $onDestroy(): void {

    // TODO: Provide ondestroy hook event for listeners

    // free BpmnJS modeler
    this._modeler.destroy();
    this._modeler = null;
  }

}



class ProcessModelerComponent implements ng.IDirective {

  bindings = {
    model: "<",
    readOnly: "<",
    ready: "&",
    error: "&",
  };

  controller = ProcessModelerController;
  template = require("./pde-modeler-container.component.pug");

}


// register component
angular
  .module("cremaPDE.processModeler")
  .component("pdeModelerContainer", new ProcessModelerComponent());
