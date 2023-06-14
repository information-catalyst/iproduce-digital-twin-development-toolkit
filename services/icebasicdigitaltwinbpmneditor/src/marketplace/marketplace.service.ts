import * as angular from "angular";

import { IServiceDTO, IQos } from "./IServiceDTO";
import { IUtilService, IAppConfig, ISpcService } from "../_common";

export interface IMarketplaceService {
  getServices(): ng.IPromise<{}>;
  getServicesUpdatedSince(dateMilliSeconds: number): ng.IPromise<{}>;
  getAbstractServices(): ng.IPromise<{}>;
  getConcreteServices(): ng.IPromise<{}>;
  getService(serviceId: string): ng.IPromise<IServiceDTO>;
  getServicesByIds(serviceIds: string[]): ng.IPromise<IServiceDTO[]>;
  isAbstractService(service: IServiceDTO): boolean;
  getMatchingServices(pmCriId: string, taskId: string, threshold?: number, limit?: number): ng.IPromise<{}>;
  generateParsedPreconditionsEffects(annotationString: string): string[];
}

interface IRequestParams {
  serviceType?: string;
  abstractId?: string;
  limit?: number;
  lastupdate?: number;
}

interface IAuthHeader {
  Authorization: string;
}

export class MarketplaceService implements IMarketplaceService {
  static $inject = ["$q", "$http", "utilService", "CONFIG", "spcService"];
  static MARKETPLACE_API_URL: string;

  constructor(
    private $q: angular.IQService,
    private $http: angular.IHttpService,
    private utilService: IUtilService,
    private APPCONFIG: IAppConfig,
    private spcService: ISpcService
  ) {
    MarketplaceService.MARKETPLACE_API_URL = this.APPCONFIG.MARKETPLACE_ENDPOINT + "/marketplace/api/services";
  }

  public getAuthHeader(): IAuthHeader {
     return {
       Authorization: "Basic dSdfnDSsZXI6QzRhJiVESjVXOTR0JTl1MktiJmVeN1ZoeGg="
     };
    // return {
      // Authorization: `Bearer ${this.spcService.getToken()}`
    // };
  }

  /**
   * get all services
   * @param  {IRequestParams} params request parameters
   * @return {ng.IPromise}
   */
  public getServices(params?: IRequestParams): ng.IPromise<IServiceDTO[]> {
    return this.utilService
      .sendRequest("GET", MarketplaceService.MARKETPLACE_API_URL, params ? params : {}, this.getAuthHeader())
      .then((response: any) => {

        const services: IServiceDTO[] = [];
        for (let i = 0, len: number = response.length; i < len; i++) {
          const service: IServiceDTO = response[i].value;
          service.parsedQos = this.generateParsedQos(service.QoS);
          service.annotation.preconditions.parsedToArray = this.generateParsedPreconditionsEffects(service.annotation.preconditions.semantic);
          service.annotation.effects.parsedToArray = this.generateParsedPreconditionsEffects(service.annotation.effects.semantic);
          service.svaEditHref = `https://tuv.crema-project.eu:34009/services/${service.serviceID}/?token=${this.spcService.getToken()}`;
          services.push(service);
        }

        return services;
      });
  }

  public getServicesUpdatedSince(dateMilliSeconds: number): ng.IPromise<{}> {
    const params = {
      lastupdate: dateMilliSeconds
    };
    return this.getServices(params);
  }
  /**
   * get concrete services only
   * @return {ng.IPromise}
   */
  public getConcreteServices(): ng.IPromise<{}> {
    const params: IRequestParams = {
      serviceType: "concrete"
    };
    return this.getServices(params);
  }
  /**
   * get abstract services only
   * @return {ng.IPromise}
   */
  public getAbstractServices(): ng.IPromise<{}> {
    const params: IRequestParams = {
      serviceType: "abstract"
    };
    return this.getServices(params);
  }
  /**
   * get single service
   * @param  {string}      serviceId
   * @return {ng.IPromise} IServiceDTO
   */
  public getService(serviceId: string): ng.IPromise<IServiceDTO> {
    return this.utilService
      .sendRequest("GET", MarketplaceService.MARKETPLACE_API_URL + "/" + serviceId, undefined, this.getAuthHeader())
      .then((response: any) => {

        if (!response || !response.length) {
          return null;
        }

        const service: IServiceDTO = response[0].value;
        service.parsedQos = this.generateParsedQos(service.QoS);
        service.annotation.preconditions.parsedToArray = this.generateParsedPreconditionsEffects(service.annotation.preconditions.semantic);
        service.annotation.effects.parsedToArray = this.generateParsedPreconditionsEffects(service.annotation.effects.semantic);

        return service;
      });
  }
  /**
   * accepts array containing multiple service id's
   * returns service values of corresponding services
   * @param  {string[]}    serviceIds
   * @return {ng.IPromise} serviceValues of corresponding id's
   */
  public getServicesByIds(serviceIds: string[]): ng.IPromise<any> {
    // will contain promises for single service calls
    const servicePromises: ng.IPromise<{}>[] = [];
    // create promise for each serviceId
    for (const serviceId of serviceIds) {

      const service = this.getService(serviceId);
      servicePromises.push(service);

    }
    // resolve promises all at once
    return this.$q.all(servicePromises);
  }

  /**
   * check if a given marketplace service is an abstract service
   * @param  {IServiceDTO} service
   * @return {boolean}             if service is abstract, return true, otherwise false
   */
  public isAbstractService(service: IServiceDTO): boolean {
    if (service.hasOwnProperty("serviceSoftware") && service.serviceSoftware !== "" && service.serviceSoftware !== null && service.serviceSoftware !== undefined) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * request matching services for a given abstractService / bpmnTask that implements an abstractService
   * @param  {string}      pmCriId   processModel._id from CRI (process needs to be stored in cloudstorage)
   * @param  {string}      taskId    id of corresponding bpmnTask
   * @param  {number}      threshold similarity threshold
   * @param  {number}      limit     limit of results
   * @return {ng.IPromise}           returns matching marketplace services, including a similarity property
   */
  public getMatchingServices(pmCriId: string, taskId: string, threshold = 0.85, limit = 10): ng.IPromise<{}> {

    const deferred: ng.IDeferred<{}> = this.$q.defer();
    const params: any = {
      session: "userToken",
      threshold: threshold,
      limit: limit
    };

    let oderuServices: any[] = [];

    // request matching services from oderu
    this.utilService
      .sendRequest("GET", this.APPCONFIG.ODERU_ENDPOINT + `oderu/Services/Matching/${pmCriId}/${taskId}`, params, this.getAuthHeader())
      .then((oderuResponse: any) => {

        oderuServices = oderuResponse;
        const serviceIds: string[] = [];

        // generate array containing ServiceIDs to request these services from marketplace
        for (const service of oderuResponse) {
          serviceIds.push(service.ServiceID);
        }

        // get matched services from marketplace
        this.getServicesByIds(serviceIds)
          .then((services: IServiceDTO[]) => {

            // add similarity property responded by oderu api to marketplace services
            for (const service of services) {
              for (const oderuService of oderuServices) {
                if (service.serviceID === oderuService.ServiceID) {
                  service.similarity = oderuService.similarity;
                }
              }
            }
            deferred.resolve(services);

          });
      });
    return deferred.promise;
  }

  /**
   * parses service.QoS into key / value / url, do present
   * is better in the Marketplace Detail Panel
   * @param  {string} qos service.QoS
   * @return {IQos[]}     array containing parsed QoS
   */
  public generateParsedQos(qos: string): IQos[] {
    const resultArray: IQos[] = [];
    // format of string: url#key=value,url#key=value
    // first split comma separated entries
    if (!qos) {
      return resultArray;
    }

    const splittedQos: string[] = qos.split(",");
    for (const qos of splittedQos) {

      const currentQos: any = {
        key: "",
        value: "",
        url: ""
      };

      const splitUrlValue: string[] = qos.split("#");
      if (splitUrlValue[0]) {
        currentQos.url = splitUrlValue[0];
      }
      let splitKeyValue: string[] = [];
      if (splitUrlValue[1]) {
        splitKeyValue = splitUrlValue[1].split("=");
      }
      if (splitKeyValue[0]) {
        currentQos.key = splitKeyValue[0];
      }
      if (splitKeyValue[1]) {
        currentQos.value = splitKeyValue[1];
      }
      resultArray.push(currentQos);
    }
    return resultArray;
  }
  /**
   * generates the "old array-based syntax style" of the precondition/effect semantic string
   * @param  {string}   annotationString annotation in PDDL syntax
   * @return {string[]}               annotationStrings converted to array
   */
  public generateParsedPreconditionsEffects(annotationString: string): string[] {
    let parsedAnnotations: string[] = [];
    if (annotationString.length > 0) {
      // if multiple annotations connected with and operator
      if (annotationString.substring(0, 3) === "and") {
        annotationString = annotationString.substring(5, annotationString.length - 1);
        parsedAnnotations = annotationString.split(")");

        for (let i = 0, len: number = parsedAnnotations.length; i < len; i++) {
          if (parsedAnnotations[i] && parsedAnnotations[i].trim() === "") { // remove empty string values
            parsedAnnotations.splice(i, 1);
            continue;
          }
          // if first character is empty string, if yes remove this char
          if (parsedAnnotations[i].substring(0, 1) === " ") {
            parsedAnnotations[i] = parsedAnnotations[i].substring(1, parsedAnnotations[i].length);
          }
          // if last character is empty string, remove this char
          if (parsedAnnotations[i].substring(parsedAnnotations[i].length - 1, parsedAnnotations[i].length) === " ") {
            // if last character is empty space, remove last character
            parsedAnnotations[i] = parsedAnnotations[i].substring(0, parsedAnnotations[i].length - 1);
          }
          parsedAnnotations[i] += ")"; // add ')' character to end of each value
        }
        // only single entry, push to array
      } else {
        parsedAnnotations.push(annotationString);
      }
    }
    return parsedAnnotations;
  }

}

angular
  .module("cremaPDE.marketplace")
  .service("marketplaceService", MarketplaceService)
  ;
