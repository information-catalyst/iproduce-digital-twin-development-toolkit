import * as angular from "angular";

import { IManagerService, IProcessModeler, IProcessModelDTO } from "_core";
import { IUrlParamService } from "_common";

import {
  IOptimizationService,
  IServicePlanService,
  IServicePlanDTO,
  IServicePlanParserService,
  IServicePlanDetail
} from "./";


enum ViewMode {
  List,
  Detail
}

interface IOptimizationState {
  plans: IServicePlanDTO[];
  selectedPlan: IServicePlanDTO;
  selectedPlanDetail: IServicePlanDetail;
  viewMode: ViewMode;
}



class OptimizationPanelController {

  static $inject = [
    "$element",
    "managerService",
    "servicePlanParserService",
    "servicePlanService",
    "optimizationService",
    "urlParamService"
  ];

  public ngShow: boolean;


  private plans: IServicePlanDTO[];
  private selectedPlan: IServicePlanDTO;
  private selectedPlanDetail: IServicePlanDetail;
  private viewMode: ViewMode;

  // dictionary of states, for multiple processes
  private states: { [id: string]: IOptimizationState };

  public currentStateId: string;

  public headerSection: string;

  // flag for loading indicator in list of service plans
  private loading: boolean;

  // flag for loading indicator in service plan
  private detailLoading: boolean;

  // display blinking effect when url action is optimisation
  public showOptimisationButtonEffect: boolean;


  constructor(
    private $element: ng.IAugmentedJQuery,
    private _managerService: IManagerService,
    private parserService: IServicePlanParserService,
    private servicePlanService: IServicePlanService,
    private optimizationService: IOptimizationService,
    private urlParamService: IUrlParamService
  ) {

    this.viewMode = ViewMode.List;
    this.loading = false;
    this.detailLoading = false;
    this.states = {};

    this._managerService.onSelectedChanged(() => {
      if (this.ngShow) {
        this.onSelectedProcessChanges();
      }
    });
  }


  public $onInit(): void {

    // if url action, show blink effect
    const urlAction = this.urlParamService.getProvidedAction();
    if (urlAction === "optimisation") {
      this.showOptimisationButtonEffect = true;
    }
  }


  public $onChanges(changes: any): void {

    if (changes.ngShow) {
      this.onSelectedProcessChanges();
    }

  }


  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }


  /**
   * Get process model from current process
   */
  private getProcessModel(): IProcessModelDTO {
    return this._managerService.getModel();
  }

  private clearState(): void {

    if (this.states[this.currentStateId]) {
      delete this.states[this.currentStateId];
    }

    this.plans = null;
    this.selectedPlan = null;
    this.selectedPlanDetail = null;
    this.viewMode = ViewMode.List;
    this.currentStateId = null;
  }

  private saveState(): void {

    if (this.currentStateId) {
      this.states[this.currentStateId] = {
        plans: this.plans,
        selectedPlan: this.selectedPlan,
        selectedPlanDetail: this.selectedPlanDetail,
        viewMode: this.viewMode
      };
    }

  }

  private loadOrCreateState(newStateId: string): IOptimizationState {

    let state: IOptimizationState = this.states[newStateId];
    if (!state) {
      state = {
        plans: null,
        selectedPlan: null,
        selectedPlanDetail: null,
        viewMode: ViewMode.List
      };
    }
    return state;
  }


  /**
   * When selected process changes, save current state and load or create a new one
   */
  private onSelectedProcessChanges(closed?: boolean): void {

    closed ? this.clearState() : this.saveState();

    const modeler = this.getModeler();
    if (!this.ngShow || !modeler) {
      return;
    }

    const newStateId: string = modeler.getId();
    if (!newStateId || this.currentStateId === newStateId) {
      return;
    }

    const state: IOptimizationState = this.loadOrCreateState(newStateId);
    angular.extend(this, state);

    this.currentStateId = newStateId;
    if (!this.plans) {
      this.loadServicePlans();
      // this.optimiseProcess();
    }
  }

  /**
   * Returns true if current view is list of service plans
   */
  public isListViewMode(): boolean {
    return this.viewMode === ViewMode.List;
  }

  /**
   * Returns true if current view is service plan detail
   */
  public isDetailViewMode(): boolean {
    return this.viewMode === ViewMode.Detail;
  }

  /**
   * Returns true if component is working
   */
  public isLoading(): boolean {
    return this.loading;
  }

  /**
   * User clicks from detail to go to list of service plans
   */
  public goToServicePlans(): void {
    this.selectedPlan = null;
    this.selectedPlanDetail = null;
    this.viewMode = ViewMode.List;
  }

  /**
   * Whether there is a selected process
   */
  public isSelectedProcess(): boolean {
    return this.getModeler() != null;
  }

  /**
   * Whether we can request optimisation or not
   */
  public canRequestOptimisation(): boolean {
    return this.optimizationService.canRequestOptimisation(this.getProcessModel());
  }

  /**
   * Returns true if model is ready
   */
  public isModelReady(): boolean {
    return this.optimizationService.isModelReady(this.getProcessModel());
  }

  /**
   * Returns true if model has tasks
   */
  public hasOptimisableTasks(): boolean {
    return this.optimizationService.hasOptimisableTasks(this.getProcessModel());
  }

  /**
   * Request optimisation for the current process
   */
  public optimiseProcess(): void {
    this.showOptimisationButtonEffect = false;

    this.loading = true;

    this.optimizationService
      .composeServicePlan(this.getProcessModel())
      .then((res: any) => {

        // result can be false, means user cancelled dialog
        if (res === false) {
          return;
        }

        this.loadServicePlans();

      })
      .catch((err) => {

        throw new Error("Could not optimise process");

      })
      .finally(() => {

        this.loading = false;

      });

  }

  /**
   * Returns true if there are service plans for the current process model
   */
  public hasServicePlans(): boolean {
    return this.plans && this.plans.length ? true : this.plans == null ? null : false;
  }

  /**
   * Retrieve existing service plans for current process
   */
  public loadServicePlans(): void {

    this.loading = true;

    const model: IProcessModelDTO = this.getProcessModel();

    this.servicePlanService
      .getAlreadyComputed(model)
      .then((plans) => {

        this.plans = plans;

        // comment after test
        // this.openServicePlan(plans[1]);

      })
      .catch((err) => {
        throw new Error((err && err.description) || "Could not retrieve service plans");
      })
      .finally(() => {
        this.loading = false;
      });
  }

  /**
   * User clicks on open specific service plan, retrieve details
   */
  public openServicePlan(plan: IServicePlanDTO): void {

    this.loading = true;

    this.parserService
      .parsePlanDetail(plan.Model, this.getModeler())
      .then((detail) => {

        this.selectedPlan = plan;
        this.selectedPlanDetail = detail;
        this.viewMode = ViewMode.Detail;

        if (!this.headerSection) {
          this.headerSection = "optimization";
        }

      })
      .catch((err) => {
        this.goToServicePlans();
        throw new Error(err || "Error parsing service plan");
      })
      .finally(() => {
        this.loading = false;
      });

  }

  /**
   * Approve current service plan
   */
  public approveServicePlan(): void {

    this.detailLoading = true;

    this.optimizationService
      .approveServicePlan(this.selectedPlan, this.getModeler())
      .then((result: boolean) => {
        this.detailLoading = false;
        this.selectedPlan.approved = true;
      })
      .finally(() => {
        this.detailLoading = false;
      })
      ;
  }

  /**
   * Reject current service plan
   */
  public rejectServicePlan(): void {

    this.detailLoading = true;

    this.optimizationService
      .rejectServicePlan(this.selectedPlan)
      .then(() => {
        this.detailLoading = false;
        this.goToServicePlans();
        this.loadServicePlans();
      })
      .finally(() => {
        this.detailLoading = false;
      })
      ;
  }

  /**
   * Returns true if the current plan has been approved or rejected
   */
  public isApprovedOrRejected(): boolean {
    return this.selectedPlan && this.selectedPlan.approved != null ? true : false;
  }

  /**
   * Returns true if the current plan has been approved
   */
  public isApproved(): boolean {
    return this.selectedPlan && this.selectedPlan.approved ? true : false;
  }

}



class OptimizationPanelComponent implements ng.IDirective {

  bindings = {
    ngShow: "<"
  };

  controller = OptimizationPanelController;
  template = require("./pde-optimization-panel.component.pug");

}



angular
  .module("cremaPDE.optimization")
  .component("pdeOptimizationPanel", new OptimizationPanelComponent())
  ;
