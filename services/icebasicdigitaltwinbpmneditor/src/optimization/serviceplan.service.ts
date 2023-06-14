import * as angular from "angular";

import { IUtilService, IAppConfig, ICriService, CriService, Entity } from "../_common";
import { IProcessModelDTO } from "_core";


/**
 * Main interface for describing list of service plans
 */
export interface IServicePlanDTO extends Entity {
  ProcessModelID?: string;
  creationTime: Date | number;
  approved: boolean;
  Model: string;
}


/**
 * Service for retrieving service plans
 */
export interface IServicePlanService extends ICriService<IServicePlanDTO> {

  /**
   * Retrieve CRI list of already computed process service plans for the given process model
   */
  getAlreadyComputed(process: IProcessModelDTO): ng.IPromise<IServicePlanDTO[]>;

}


/**
 * Service for retrieving service plans
 */
class ServicePlanService extends CriService<IServicePlanDTO> implements IServicePlanService {

  static $inject = [
    "$q",
    "$timeout",
    "utilService",
    "CONFIG"
  ];

  constructor(
    private $q: ng.IQService,
    private $timeout: ng.ITimeoutService,
    utilService: IUtilService,
    CONFIG: IAppConfig
  ) {
    super(utilService, CONFIG);
  }


  public getBucketName(): string {
    return "processServicePlans";
  }

  public getOrganizationName(): string {
    return "crema";
  }

  public getApplicationName(): string {
    return "main";
  }

  public getOwnerName(): string {
    return "oderu";
  }

  /**
   * Retrieve CRI list of already computed process service plans for the given process model
   */
  public getAlreadyComputed(process: IProcessModelDTO): ng.IPromise<IServicePlanDTO[]> {

    return this.getAll({
      "find_one": false,
      "query": {
        "ProcessModelID": process._id
      }
    }).then((sps: IServicePlanDTO[]) => {

      return sps;

    });

  }
}


angular
  .module("cremaPDE.optimization")
  .service("servicePlanService", ServicePlanService)
  ;
