import * as angular from "angular";

import { IManagerService, IProcessModelDTO, IProcessModeler } from "_core";
import { IMarketplaceService } from "./marketplace.service";
import { IMarketplaceRenderService } from "./marketplace-render.service";
import { IMarketplaceSyncService } from "./marketplace-sync.service";
import {
  ICanvasService,
  ISelectionService
} from "../process-modeler";

import { IServiceDTO } from "./IServiceDTO";



export interface IMarketplaceController {
  resetDetailView(): void;
  getServices(): void;
}

export class MarketplaceController implements IMarketplaceController {

  static $inject = [
    "$scope",
    "$element",
    "$uibModal",
    "managerService",
    "marketplaceService",
    "marketplaceRenderService",
    "selectionService",
    "marketplaceSyncService"
  ];

  // injected during onInit phase
  public ngShow: boolean;

  // loading indicator
  public loading: boolean;

  // holds service from marketplace api
  public services: IServiceDTO[];

  // if true, marketplace-detail-panel will be shown
  public showServiceDetail: boolean;

  // currently selected service (by clicking on row)
  public selectedService: IServiceDTO;

  // currently hovered service
  public hoveredService: IServiceDTO;

  // if true, detail-panel is expanded
  public panelExpanded: boolean;

  // can either be 'all', 'abstract' or 'concrete'
  public activeServiceType: string;

  public sortType: string;

  public sortReversed: boolean;

  public loadedInDashboard: boolean;

  public showDefaults: boolean;

  public defaults: any[];

  public search: any;
  public elementMarkedForReplacement: BpmnJS.IRegistryElement;

  // if true, shows a message that process needs to be stored in CRI (required for service matching)
  public showErrorCRI: boolean;

  constructor(
    public $scope: ng.IScope,
    public $element: JQuery,
    public $uibModal: ng.ui.bootstrap.IModalService,
    private _managerService: IManagerService,
    public marketplaceService: IMarketplaceService,
    public marketplaceRenderService: IMarketplaceRenderService,
    private selectionService: ISelectionService,
    private marketplaceSyncService: IMarketplaceSyncService
  ) {

    this.loading = false;
    this.showServiceDetail = false;
    this.panelExpanded = false;
    this.activeServiceType = "all";
    this.sortType = "name";
    this.sortReversed = false;
    this.loadedInDashboard = false;
    this.showDefaults = false;
    this.search = { name: "" };
    this.showErrorCRI = false;

  }

  public $onInit(): void {
    this.registerDragAndDrop();
  }

  checkForOutdatedServices() {
    console.log("test");
  }

  public toggleDefaults(): void {
    this.showDefaults = !this.showDefaults;
    if (this.showDefaults) {
      this.defaults = this.marketplaceRenderService.getDefaults();
    }

  }

  public removeDefault(abstractId: string): void {
    let index: number = -1;
    for (const def of this.defaults) {
      if (def.for === abstractId) {
        index = this.defaults.indexOf(def);
        console.log("remove default");
        this.defaults.splice(index, 1);
      }
    }
    console.log(`default for ${abstractId} should be removed`);
  }

  /**
   * replaces this.elementMarkedForReplacement with given service
   * including <crema:implementation> and all other stuff
   * @param {IServiceDTO} service [description]
   */
  public replaceServiceWith(service: IServiceDTO): void {
    if (this.elementMarkedForReplacement && service) {
      this.marketplaceRenderService.replaceServiceWith(service, this.elementMarkedForReplacement);
      this.getServices();
    } else {
      console.error("no element stored for replacement");
    }
  }

  /**
   * checks the current selected element in designer
   * if crema-service (detected by existence of property camunda:type)
   * return true, otherwise false
   * @return {boolean}
   */
  public isSelectionMarketplaceService(): boolean {
    let currentSelections: BpmnJS.IRegistryElement[] = [];
    try {
      currentSelections = this.selectionService.get();
    } catch (e) {
      return false;
    }
    if (currentSelections.length > 1 || currentSelections.length === 0) {
      return false;
    } else if (currentSelections[0].type === "bpmn:ServiceTask" && currentSelections[0].businessObject.$attrs.hasOwnProperty("camunda:topic")) {
      // currently detecting marketplace services by presence of property camunda:type
      return true;
    }
    return false;
  }

  public getMatchingServices(): void {
    this.showErrorCRI = false;
    let currentSelections: BpmnJS.IRegistryElement[] = [];

    try {
      // currently selected items in designer
      currentSelections = this.selectionService.get();
    } catch (e) {
      console.error(e);
      console.error("getMatchingService failed, could not get current selection");
      return;
    }

    // currently activated process in designer
    const currentProcessModel: IProcessModelDTO = this._managerService.getModel();
    const selectedTask: BpmnJS.IRegistryElement = currentSelections[0];
    // store element, until user selects a service to replace this task with
    this.elementMarkedForReplacement = selectedTask;

    if (this.isSelectionMarketplaceService()) {

      // check if processModel has a _id property set (= is stored in Process Store, necessary for matching))
      if (currentProcessModel._id) {
        this.showErrorCRI = false;
        // TODO: SHOW MESSAGE THAT CONCRETE DEFAULT WAS USED
        this.activeServiceType = "matching";
        this.search.name = "";
        this.sortType = "similarity";
        this.sortReversed = true;
        this.loading = true;

        if (this._managerService.hasChanges()) {

          // if current process has changes, ask for save it first (to consider changes on service matching on ODERU)
          this.$uibModal.open({
            animation: true,
            template: require("./view/save-changes-matching/save-changes-matching.pug"),
            controller: angular.noop,
            controllerAs: "vm",
            size: "xs"
          })
            .result
            .then((e) => {
              if (e === "yes") {
                return this._managerService.saveChanges();
              }
            })
            .then(() => {
              this.marketplaceService
                .getMatchingServices(currentProcessModel._id, selectedTask.id)
                .then((matchingServices: any) => {
                  this.services = matchingServices;
                  // TODO: assign services to this.services
                  this.loading = false;
                }, (err: any) => {
                  console.log(err);
                });
            });

        } else {
          this.marketplaceService
            .getMatchingServices(currentProcessModel._id, selectedTask.id)
            .then((matchingServices: any) => {
              this.services = matchingServices;
              // TODO: assign services to this.services
              this.loading = false;
            }, (err: any) => {
              console.log(err);
            });
        }
      } else {
        this.showErrorCRI = true;
      }
    }


  }

  public isDraggable(service: IServiceDTO): boolean {
    if (this.selectedService) {
      if (this.selectedService === service) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }



  public $onChanges(changes: any): void {
    if (changes.ngShow && changes.ngShow.currentValue === true) {
      this.getServices();
    }
  }


  public getInputOutputName(annotationsString: string): string {
    const splittedAnnotation: string[] = this.marketplaceRenderService.splitInputOutput(annotationsString);
    return splittedAnnotation[1];
  }

  public getInputOutputUrl(annotationsString: string): string {
    const splittedAnnotation: string[] = this.marketplaceRenderService.splitInputOutput(annotationsString);
    return splittedAnnotation[0];
  }

  public getPreconditionEffectName(annotationString: string): string {
    const splittedAnnotation: string[] = this.marketplaceRenderService.splitPreconditionEffect(annotationString);
    return splittedAnnotation[1];
  }

  public getPreconditionEffectUrl(annotationString: string): string {
    const splittedAnnotation: string[] = this.marketplaceRenderService.splitPreconditionEffect(annotationString);
    return splittedAnnotation[0];
  }


  private registerDragAndDrop(): void {

    // only possible way to check if loaded in CREMA Dashboard or not
    // console.log(window.self !== window.top);
    // when user hovers over process tab, change current selected tab (this is to support drop file as subprocess)
    this.$element.on("dragstart", ".service", (e: any) => {
      e.originalEvent.dataTransfer.setData("text/plain", "node");
      const dragImage: any = document.getElementById("service-icon");
      e.originalEvent.dataTransfer.setDragImage(dragImage, 50, 50);
      this.showServiceDetail = false;
      // force angular to apply variable change (hide showServiceDetail on Drag & Drop)
      this.$scope.$apply();
    });

    this.$element.on("dragend", ".service", (e: JQueryEventObject) => {

      const pageX: number = e.pageX;
      const pageY: number = e.pageY;
      this.showServiceDetail = false;

      // latest hovered service
      const service: IServiceDTO = this.hoveredService;

      // call render service
      this.marketplaceRenderService.renderService(service, pageX, pageY);
      if (this.selectedService) {
        this.showServiceDetail = true;
      }

    });
  }


  /** hides detail view and resets selectedService */
  public resetDetailView(): void {
    this.selectedService = null;
    this.showServiceDetail = false;
  }

  /** get all services */
  public getServices(): void {
    this.activeServiceType = "all";
    this.showErrorCRI = false;
    this.loading = true;
    this.marketplaceService
      .getServices()
      .then((services: IServiceDTO[]) => {
        this.services = services;
        this.loading = false;
      });
  }

  /** get abstract services */
  public getAbstractServices(): void {
    this.activeServiceType = "abstract";
    this.showErrorCRI = false;
    this.loading = true;
    this.marketplaceService
      .getAbstractServices()
      .then((services: IServiceDTO[]) => {
        this.services = services;
        this.loading = false;
      });
  }

  /** get concrete services */
  public getConcreteServices(): void {
    this.activeServiceType = "concrete";
    this.showErrorCRI = false;
    this.loading = true;
    this.marketplaceService
      .getConcreteServices()
      .then((services: IServiceDTO[]) => {
        this.services = services;
        this.loading = false;
      });
  }

  /**
   * checks, if a given service is abstract
   * @param  {IServiceDTO} service
   * @return {boolean}             true if abstract, false if concrete
   */
  public isAbstractService(service: IServiceDTO): boolean {
    return this.marketplaceService.isAbstractService(service);
  }

  public getIconSrc(service: IServiceDTO): string {
    return "data:image/png;base64," + service.iconData;
  }

}


export class MarketplaceComponent implements ng.IDirective {

  bindings = {
    ngShow: "<"
  };

  controller = MarketplaceController;
  template = require("./pde-marketplace.component.pug");

}


angular
  .module("cremaPDE.marketplace")
  .component("pdeMarketplace", new MarketplaceComponent());
