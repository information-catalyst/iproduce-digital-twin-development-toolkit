import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";
import { IOverlayService, ISelectionService } from "../process-modeler";
import { IServicePlanDetail, IServicePlanChangeDetail } from "./";
import { IConcreteServiceImplementation, IServiceBinding, IServiceBindingDef } from "./";
import { IMarketplaceSyncService } from "marketplace/marketplace-sync.service";
import { IServiceDTO } from "marketplace/IServiceDTO";
import { ISpcService } from "_common";



class OptimizationChangesController {

  static $inject = [
    "$element",
    "$scope",
    "$compile",
    "managerService",
    "overlayService",
    "selectionService",
    "marketplaceSyncService",
    "spcService"
  ];

  private services: IServiceDTO[];

  private processId: string;

  public selectedPlanDetail: IServicePlanDetail;

  public selectedChangeDetail: IServicePlanChangeDetail;
  private selectedChangeDetailId: string;

  // get just the html template
  private templateContent: string;

  // allow show PSP XML
  private xmlView: boolean;


  constructor(
    private $element: ng.IAugmentedJQuery,
    private $scope: ng.IScope,
    private $compile: ng.ICompileService,
    private _managerService: IManagerService,
    private _overlayService: IOverlayService,
    private _selectionService: ISelectionService,
    private _marketplaceSyncService: IMarketplaceSyncService,
    private _spcService: ISpcService
  ) {

    // intiially set to false to ng-switch to work
    this.xmlView = false;

    // cache the content we will use for overlay
    this.templateContent = this.$element.find("#optimization-change-detail").contents()[0].nodeValue;

    // attach to selection changed
    this._selectionService.onSelectionChanged(this.onProcessSelectionChange.bind(this));

    // clear overlays if another selected plan is selected or the panel is closed
    this.$scope.$watch("$ctrl.selectedPlanDetail", () => { this.clearOverlays(); });
  }


  private clearOverlays(): void {
    // TODO: Delete only overlays that belong to optimization
    this._overlayService.clearOverlays();
    this.xmlView = false;
  }


  // enable process selection synchronization
  private onProcessSelectionChange(): void {

    if (!this.selectedPlanDetail || !this.selectedPlanDetail.changes.length) {
      this.clearOverlays();
      return;
    }

    const selection: BpmnJS.IRegistryElement[] = this._selectionService.get();
    if (!selection || !selection.length) {
      this.selectedChangeDetail = null;
      this.selectedChangeDetailId = null;
      this.clearOverlays();
      return;
    }

    const sel: BpmnJS.IRegistryElement = selection[0];

    // if already selected, avoid double call
    if (this.selectedChangeDetail && sel.id === this.selectedChangeDetail.id) {
      return;
    }

    const d: IServicePlanChangeDetail[] = this.selectedPlanDetail.changes.filter((o: IServicePlanChangeDetail) => {
      return o.id === sel.id;
    });

    if (d.length) {
      this.selectImplementation(d[0]);
    } else {
      this.selectedChangeDetail = null;
      this.selectedChangeDetailId = null;
      this.clearOverlays();
    }

  }

  /*
  * Returns true if PSP XML view is the active view
  */
  public isXmlView(): boolean {
    return this.xmlView;
  }

  /*
  * User wants to show/hide PSP XML view
  */
  public toggleXmlView(): void {
    this.xmlView = !this.xmlView;
  }


  public getSelectedPlanImplementations(): IServicePlanChangeDetail[] {
    return this.selectedPlanDetail && this.selectedPlanDetail.changes || [];
  }


  public getSelectedPlanImplementationCount(): number {
    return this.getSelectedPlanImplementations().length;
  }


  public selectImplementation(item: IServicePlanChangeDetail): void {

    if (!item.element) {
      return;
    }

    // clear previous overlays
    this.clearOverlays();

    this.selectedChangeDetail = item;
    this.selectedChangeDetailId = item.id;
    this._selectionService.selectById(item.id);

    // now render using our scope
    const compiledContent: ng.IAugmentedJQuery = this.$compile(this.templateContent)(this.$scope);
    compiledContent.on("click", (evt: JQueryEventObject) => {
      evt.preventDefault();
      return false;
    });

    // and create the overlay
    this._overlayService.addOverlay({
      elementId: item.id,
      content: compiledContent,
      position: "right"
    });

  }


  public isSelectedImplementation(item: IServicePlanChangeDetail): boolean {
    return this.selectedChangeDetail === item;
  }


  public getImplementationName(impl: IServicePlanChangeDetail): any {
    return impl.element ? <any>impl.element.businessObject.name : null;
  }


  public getImplementationSequence(impl: IServicePlanChangeDetail): any {
    return impl.implementation.seq;
  }


  public isImplementationOriginOptimization(impl: IServicePlanChangeDetail): boolean {
    return impl ? impl.implementation.isFromOptimization : this.selectedChangeDetail && this.selectedChangeDetail.implementation.isFromOptimization || null;
  }


  public getImplementationOrigin(impl: IServicePlanChangeDetail): string {
    return impl.element ? this.isImplementationOriginOptimization(impl) ? "Optimisation found" : "Unchanged" : "Error";
  }


  public getAbstractService(): any {
    return this.selectedChangeDetail && this.selectedChangeDetail.implementation.abstract.marketplaceServiceId || null;
  }


  public getConcreteServices(): any {
    return this.selectedChangeDetail && this.selectedChangeDetail.implementation.concretes || null;
  }

  public getSvaEditHrefByServiceId(serviceId: string) {
    // return ``;
  }


  public getConcreteServiceAssignments(service: IConcreteServiceImplementation): any {
    return service.assignments;
  }


  public getConcreteServiceBindings(service: IConcreteServiceImplementation): any {
    return service.bindings;
  }


  public getConcreteServiceBindingOrigin(binding: IServiceBinding): string {
    return this.getConcreteServiceBindingText(binding.origin);
  }


  public getConcreteServiceBindingTarget(binding: IServiceBinding): string {
    return this.getConcreteServiceBindingText(binding.target);
  }


  public getConcreteServiceBindingText(bindingDef: IServiceBindingDef): string {
    return bindingDef.env ? "Env" : `${this.getServiceNameByServiceId(bindingDef.service)}.${bindingDef.name}`;
  }

  public getServiceNameByServiceId(serviceId: string) {
    const service: IServiceDTO = this._marketplaceSyncService.getServiceByServiceId(serviceId);
    if (service) {
      return service.name;
    } else {
      return "service name not found";
    }
  }

  public openSvaEdit(serviceId: string) {
    const url = `https://tuv.crema-project.eu:34009/services/${serviceId}?token=${this._spcService.getToken()}`;
    window.open(url, "_blank");
  }

}



class OptimizationChangesComponent implements ng.IDirective {

  bindings = {
    selectedPlanDetail: "<"
  };

  controller = OptimizationChangesController;
  template = require("./pde-optimization-changes.component.pug");

}



angular
  .module("cremaPDE.optimization")
  .component("pdeOptimizationChanges", new OptimizationChangesComponent())
  ;
