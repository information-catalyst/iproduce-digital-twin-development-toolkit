import * as angular from "angular";

import { IManagerService, IProcessModeler, IProcessModelDTO } from "_core";
import { IUtilService, IAppConfig } from "../_common/";
import { IServicePlanDTO } from "./";
import { ISpcService } from "../_common/services";
import { IRegistryService } from "process-modeler";
import { IProcessAnnotationsService } from "annotations";

/**
 * Optimisation service management
 */
export interface IOptimizationService {

  /**
   * Returns true if given model can be optimized
   */
  canRequestOptimisation(model: IProcessModelDTO): boolean;

  /**
   * Request ODERU create a new service plan for the given process model
   */
  composeServicePlan(model: IProcessModelDTO): ng.IPromise<{}>;

  /**
   * Request ODERU to approve given service plan
   */
  approveServicePlan(plan: IServicePlanDTO, modeler: IProcessModeler): ng.IPromise<{}>;

  /**
   * Request ODERU to reject given service plan
   */
  rejectServicePlan(plan: IServicePlanDTO): ng.IPromise<{}>;

  /**
   * Returns true if model is ready
   */
  isModelReady(model: IProcessModelDTO): boolean;

  /**
   * Returns true if model has tasks
   */
  hasOptimisableTasks(model: IProcessModelDTO): boolean;
}



/**
 * Optimisation service management
 */
class OptimizationService implements IOptimizationService {

  static $inject = [
    "$q",
    "$timeout",
    "managerService",
    "registryService",
    "utilService",
    "CONFIG",
    "$uibModal",
    "spcService",
    "processAnnotationsService"
  ];

  constructor(
    private $q: ng.IQService,
    private $timeout: ng.ITimeoutService,
    private _managerService: IManagerService,
    private _registryService: IRegistryService,
    private utilService: IUtilService,
    private APPCONFIG: IAppConfig,
    private $uibModal: angular.ui.bootstrap.IModalService,
    private spcService: ISpcService,
    private processAnnotationsService: IProcessAnnotationsService
  ) {
  }


  /**
   * Returns true if the ODERU Endpoint has been set in config
   */
  private hasOderuEndpoint(): boolean {
    return this.APPCONFIG.ODERU_ENDPOINT ? true : false;
  }


  /**
   * Constructs ODERU Endpoint
   */
  private getOderuEndpoint(): string {
    let url: string = this.APPCONFIG.ODERU_ENDPOINT;
    if (!url) {
      throw "ODERU Endpoint not set";
    }

    if (url.charAt(url.length - 1) !== "/") {
      url = url + "/";
    }

    return url + "oderu/";
  }

  private getAuthorizationHeaders(): any {
    return {
      "Authorization": `Bearer ${this.spcService.getToken()}`
    };
    // return {
    //   "Authorization": "Basic dGVzdHVzZXI6QzRhJiVESjVXOTR0JTl1MktiJmVeN1ZoeGg="
    // };
  }


  /**
   * Returns ODERU Endpoint for compose service plan (should be used if PM does not include a COP problem)
   */
  private getComposeEndpoint(): string {
    return this.getOderuEndpoint() + "PM/Compose/?session=userToken";
  }

  /**
   * Returns ODERU Endpoint for realise service plan (should be used if PM includes a COP problem)
   */
  private getRealiseEndpoint(): string {
    return this.getOderuEndpoint() + "PM/Realise/?session=userToken";
  }

  /**
   * Returns ODERU Endpoint for approve/reject service plan
   */
  private getApproveRejectEndpoint(): string {
    return this.getOderuEndpoint() + "PSP/Approve/?session=userToken";
  }

  /**
   * Returns true if optimisation can be requested
   */
  public canRequestOptimisation(model: IProcessModelDTO): boolean {
    return this.isModelReady(model) && this.hasOptimisableTasks(model);
  }

  /**
   * Returns true if model is ready
   */
  public isModelReady(model: IProcessModelDTO): boolean {
    return model && this._managerService.isNew() === false && this._managerService.hasChanges() === false;
  }

  /**
   * Returns true if model has tasks
   */
  public hasOptimisableTasks(model: IProcessModelDTO): boolean {
    if (!model) {
      return false;
    }

    for (const element of this._registryService.getAll()) {
      if (/Task|SubProcess/.test(element.businessObject.$type)) {
        return true;
      }
    }

    return false;
  }


  /**
   * Request ODERU create a new service plan for the given process model
   */
  composeServicePlan(model: IProcessModelDTO): ng.IPromise<{}> {

    if (this.hasOderuEndpoint()) {

      return this.$uibModal.open({
        template: require("./view/dlg.compose.psp.pug"),
        size: "md",
        backdrop: false,
      }).result.then((minutes: number) => {

        if (minutes == null) {
          return "";
        }

        const copProblem = this.processAnnotationsService.getOptimizationFormulation({ element: null });
        let endpointUrl = this.getComposeEndpoint();
        if (copProblem && copProblem.value && copProblem.value.trim().length > 0) {
          endpointUrl = this.getRealiseEndpoint();
        }
        const deadLine: Date = new Date(new Date().getTime() + minutes * 60000);

        return this.utilService.sendRequest(
          "PUT",
          endpointUrl,
          {
            ModelID: model._id,
            deadline: new Date(deadLine).toISOString(),
          },
          this.getAuthorizationHeaders()
        );

      });

    } else {

      // fake call
      return this.$q((resolve, reject) => {

        return this.$timeout(() => {

          return resolve();

        }, 1000);

      });

    }
  }


  /**
   * Approve or reject given process service plan
   */
  private approveOrRejectServicePlan(plan: IServicePlanDTO, approve: boolean): ng.IPromise<{}> {

    if (this.hasOderuEndpoint()) {

      return this.utilService.sendRequest("PUT", this.getApproveRejectEndpoint(),
        {
          ModelID: plan._id,
          approval: approve,
        }, this.getAuthorizationHeaders());

    } else {

      return this.$q((resolve, reject) => {
        return this.$timeout(angular.noop, 1000);
      });

    }

  }


  /**
   * Approve service plan
   */
  public approveServicePlan(plan: IServicePlanDTO): ng.IPromise<{}> {

    return this.$q((resolve, reject) => {

      if (this._managerService.hasChanges()) {
        return reject("Can't approve, process has pending changes");
      }

      return this.$uibModal.open({
        template: require("./view/dlg.approve.psp.pug"),
        controller: angular.noop,
        size: "md",
        backdrop: false,
      }).result.then(() => {

        return this.approveOrRejectServicePlan(plan, true)
          .then(() => {
            // modeler.getModel().processServicePlanId = plan._id;
            // return modeler.saveChanges().then(() => {
            //     return resolve(true);
            // });
            return resolve(true);
          })
          .catch(() => {
            return reject("Operation error");
          });

      }, () => { return resolve(false); });

    });
  }


  /**
   * Reject service plan
   */
  public rejectServicePlan(plan: IServicePlanDTO): ng.IPromise<{}> {
    return this.approveOrRejectServicePlan(plan, false);
  }
}


angular
  .module("cremaPDE.optimization")
  .service("optimizationService", OptimizationService)
  ;
