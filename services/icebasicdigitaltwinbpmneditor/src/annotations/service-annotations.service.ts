import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";
import { IModdleService } from "process-modeler";

import { CREMATYPES } from "./crema-types";
import { IProcessAnnotationsService } from "./process-annotations.service";
import {
  ICremaProcess,
  ICremaMetadata,
  IGetSetAnnotations,
  ICremaServiceImplementation,
  ICremaMarketplaceService,
  ICremaAbstractService,
  ICremaConcreteService,
  ICremaDefault,
  ICremaDefaultCollection,

} from "./common";
import { IServiceImplementation } from "marketplace/marketplace-sync.service";


export interface IGetSetDefaultExpression extends IGetSetAnnotations {
  abstractId: string;
  concreteId: string;
}


export interface ICreateServiceImplementationExpression extends IGetSetAnnotations {
  serviceId: string; // serviceId of service
  implements: string; // id of corresponding bpmn:serviceTask
}


export interface IServiceAnnotationsService {
  /**
   * Get the serviceID of a <crema:service> implementation
   */
  getServiceIdByImplementation(implementation: IServiceImplementation): string;

  /**
   * Get list of service implementations
   */
  getServiceImplementations(options: IGetSetAnnotations): ICremaServiceImplementation[];

  /**
   * Returns single service implementation for given element
   */
  getServiceImplementation(element: BpmnJS.IRegistryElement): ICremaServiceImplementation[];

  /**
   * Returns true if the given element is a service implementation
   */
  isServiceImplementation(element: any): boolean;

  /**
   * Get service implementation identifier
   */
  getServiceImplementationId(impl: ICremaServiceImplementation): string;

  /**
   * Adds new service implementation
   */
  addServiceImplementation(impls: ICremaServiceImplementation[]): void;

  /**
   * Adds concrete service implementation
   */
  addConcreteServiceImplementation(options: ICreateServiceImplementationExpression): ICremaServiceImplementation;

  /**
   * Adds abstract service implementation
   */
  addAbstractServiceImplementation(options: ICreateServiceImplementationExpression): ICremaServiceImplementation;

  /**
   * Removes service implementation
   */
  removeServiceImplementationByImplementsId(implementsId: string): ICremaServiceImplementation[];

  /**
   * returns all bpmn:serviceTask elements that corresponds to a given serviceId
   */
  getServiceTasksByServiceId(serviceId: string, type?: string): any[];

  /**
   * Get default service collection
   */
  getDefaults(options: IGetSetAnnotations): ICremaDefaultCollection;

  /**
   * Adds new default service definition for given element
   */
  addDefault(options: IGetSetDefaultExpression): ICremaDefault;

  /**
   * Get default service by service Id
   */
  getDefault(options: IGetSetAnnotations, serviceId: string): ICremaDefault;

  /**
   * Removes service defaults definitions
   */
  clearDefaults(options: IGetSetAnnotations): void;

}




class ServiceAnnotationsService implements IServiceAnnotationsService {

  static $inject = [
    "moddleService",
    "processAnnotationsService"
  ];
  constructor(
    private _moddleService: IModdleService,
    private _processAnnotations: IProcessAnnotationsService
  ) {
  }


  /**
   * Create business object element using moddle service
   */
  private createElement($type: string, props?: any): any {
    return this._moddleService.createElement($type, props);
  }

  /**
   * Get list of service implementations
   */
  public getServiceImplementations(options: IGetSetAnnotations): ICremaServiceImplementation[] {

    const metadata: ICremaMetadata = this._processAnnotations.getProcessMetadata(options);
    if (metadata == null) {
      return null;
    }

    if (options.create && !metadata.implementation) {
      metadata.implementation = this.createElement(CREMATYPES.IMPLEMENTATION);
    }

    if (options.create && !metadata.implementation.services) {
      metadata.implementation.services = [];
    }

    // metadata.set("approved", false);
    return metadata && metadata.implementation && metadata.implementation.services || null;
  }

  /**
   * Returns single service implementation for given element
   */
  public getServiceImplementation(element: BpmnJS.IRegistryElement): ICremaServiceImplementation[] {

    const rootProcess: ICremaProcess = this._processAnnotations.getRootProcess();
    const options: IGetSetAnnotations = {
      element: rootProcess
    };

    const implementedServices: ICremaServiceImplementation[] = this.getServiceImplementations(options);
    return implementedServices && implementedServices.filter((i: ICremaServiceImplementation) => i.implements === element.id) || null;
  }

  /**
   * Returns true if the given element is a service implementation
   */
  public isServiceImplementation(element: any): boolean {
    return element && ((element.businessObject && element.businessObject.$type === CREMATYPES.SERVICE)
      || (element.$type === CREMATYPES.SERVICE));
  }

  /**
   * Get service implementation identifier
   */
  public getServiceImplementationId(impl: ICremaServiceImplementation): string {
    return impl.implements.replace("[", "").replace("]", "");
  }

  /**
   * Adds new service implementation
   */
  public addServiceImplementation(impls: ICremaServiceImplementation[]): void {

    const rootProcess: ICremaProcess = this._processAnnotations.getRootProcess();
    const options: IGetSetAnnotations = {
      element: rootProcess,
      create: true
    };

    const implementedServices: ICremaServiceImplementation[] = this.getServiceImplementations(options);
    impls.forEach((impl) => implementedServices.push(impl));
  }

  /**
   * Adds concrete service implementation
   */
  public addConcreteServiceImplementation(options: ICreateServiceImplementationExpression): ICremaServiceImplementation {

    // get root process (needed for getProcessImplementation)
    const rootProcess: ICremaProcess = this._processAnnotations.getRootProcess();

    // options for getProcessImplementation (rootProcess set as element)
    const processOptions: IGetSetAnnotations = {
      create: true,
      element: rootProcess
    };

    // array of service implementations at process level
    const serviceImplementations: ICremaServiceImplementation[] = this.getServiceImplementations(processOptions);

    // create marketplaceServiceId element (used either by abstractService or concreteService)
    const serviceId: ICremaMarketplaceService = this.createElement(CREMATYPES.MARKETPLACE_SERVICE_ID, {
      id: options.serviceId
    });

    const abstractService: ICremaAbstractService = this.createElement(CREMATYPES.ABSTRACT_SERVICE);
    const concreteService: ICremaConcreteService = this.createElement(CREMATYPES.CONCRETE_SERVICE, {
      marketplaceServiceID: serviceId,
      origin: "designer"
    });

    const cremaService: ICremaServiceImplementation = this.createElement(CREMATYPES.SERVICE, {
      implements: `${options.element.id}`,
      seq: 1,
      abstractService: abstractService,
      concreteService: concreteService
    });
    serviceImplementations.push(cremaService);
    return cremaService;
  }


  /**
   * Adds abstract service implementation
   */
  public addAbstractServiceImplementation(options: ICreateServiceImplementationExpression): ICremaServiceImplementation {

    const rootProcess: ICremaProcess = this._processAnnotations.getRootProcess();

    // options for getProcessImplementation (rootProcess set as element)
    const processOptions: IGetSetAnnotations = {
      create: true,
      element: rootProcess
    };

    // array of service implementations at process level
    const serviceImplementations: ICremaServiceImplementation[] = this.getServiceImplementations(processOptions);

    // create marketplaceServiceId element (used either by abstractService or concreteService)
    const serviceId: ICremaMarketplaceService = this.createElement(CREMATYPES.MARKETPLACE_SERVICE_ID, {
      id: options.serviceId
    });

    const abstractService: ICremaAbstractService = this.createElement(CREMATYPES.ABSTRACT_SERVICE, {
      marketplaceServiceID: serviceId
    });

    const concreteService: ICremaConcreteService = this.createElement(CREMATYPES.CONCRETE_SERVICE, {
      origin: "designer"
    });

    const cremaService: ICremaServiceImplementation = this.createElement(CREMATYPES.SERVICE, {
      implements: `${options.element.id}`,
      seq: 1,
      abstractService: abstractService,
      concreteService: concreteService
    });

    serviceImplementations.push(cremaService);
    return cremaService;
  }


  /**
   * Removes service implementation
   */
  public removeServiceImplementationByImplementsId(implementsId: string): ICremaServiceImplementation[] {

    const rootProcess: ICremaProcess = this._processAnnotations.getRootProcess();
    const options: IGetSetAnnotations = {
      element: rootProcess
    };

    const deletedImpls: ICremaServiceImplementation[] = [];
    const implementedServices: ICremaServiceImplementation[] = this.getServiceImplementations(options);

    if (implementedServices) {

      for (const service of implementedServices) {
        if (service.implements === implementsId) {
          const index: number = implementedServices.indexOf(service);
          implementedServices.splice(index, 1);
          deletedImpls.push(service);
        }
      }
    }

    return deletedImpls;
  }

  /**
   * return the serviceID of a service implementation
   * @param  {IServiceImplementation} implementation <crema:service> inside <crema:implementation>
   * @return {string}
   */
  getServiceIdByImplementation(implementation: IServiceImplementation): string {
    const isAbstract = implementation.abstractService && implementation.abstractService.marketplaceServiceID && implementation.abstractService.marketplaceServiceID.id;
    const isConcrete = implementation.concreteService && implementation.concreteService.marketplaceServiceID && implementation.concreteService.marketplaceServiceID.id;
    if (isAbstract) {
      return implementation.abstractService.marketplaceServiceID.id;
    } else if (isConcrete) {
      return implementation.concreteService.marketplaceServiceID.id;
    }
  }
  /**
   * returns all bpmn:serviceTask elements that corresponds to a given serviceId
   * @param  {string}              serviceId marketplace service.serviceID
   * @return {any[]}                         array of bpmn:serviceTask elements
   */
  public getServiceTasksByServiceId(serviceId: string, type = "all"): any[] {

    interface ICremaProcessExtended extends ICremaProcess {
      flowElements?: any[];
    }

    const rootProcess: ICremaProcessExtended = this._processAnnotations.getRootProcess();
    let serviceImplementations: any[] = [];

    // get all service implementations
    if (rootProcess.extensionElements) {
      for (const element of rootProcess.extensionElements.values) {
        if (element.$type === "crema:Metadata" && element.implementation && element.implementation.services) {
          serviceImplementations = element.implementation.services;
        }
      }
    }

    const serviceTasks: any[] = [];
    if (rootProcess.flowElements) {
      for (const service of serviceImplementations) {
        let matchingService = true;
        // check if we only want serviceTasks that correspond to abstract services
        if (type === "abstract") {
          matchingService = service.abstractService && service.abstractService.marketplaceServiceID;
        }
        // if service implementation corresponds to abstract service id
        if (matchingService && serviceId === this.getServiceIdByImplementation(service)) {
          // loop over all bpmnServiceTask element and add bpmn:serviceTasks that correspond to service imlementation to serviceTasks array
          for (const element of rootProcess.flowElements) {
            if (element.id === service.implements) {
              serviceTasks.push(element);
            }
          }
        }
      }
    }
    return serviceTasks;
  }

  /**
   * Get default service collection
   */
  public getDefaults(options: IGetSetAnnotations): ICremaDefaultCollection {

    const rootProcess: ICremaProcess = this._processAnnotations.getRootProcess();

    // options for getProcessImplementation (rootProcess set as element)
    const processOptions: IGetSetAnnotations = {
      create: true,
      element: rootProcess
    };

    // array of service implementations at process level
    const metadata: ICremaMetadata = this._processAnnotations.getProcessMetadata(processOptions);

    if (metadata == null) {
      return null;
    }

    if (options.create && !metadata.defaults) {
      metadata.defaults = this.createElement(CREMATYPES.DEFAULTS);
      metadata.defaults.defaults = [];
    }
    return metadata.defaults;
  }


  /**
   * Get default service by service Id
   */
  public getDefault(options: IGetSetAnnotations, serviceId: string): ICremaDefault {

    const defaults: ICremaDefaultCollection = this.getDefaults(options);
    if (defaults && defaults.defaults && defaults.defaults.length > 0) {
      for (const def of defaults.defaults) {
        if (def.for === serviceId) {
          // return default for this abstract service (= serviceID of default concrete service)
          return def;
        }
      }
    }

    return null;
  }

  /**
   * Adds new default service definition for given element
   */
  public addDefault(options: IGetSetDefaultExpression): ICremaDefault {

    const defaults: ICremaDefaultCollection = this.getDefaults(options);
    let def = this.getDefault(options, options.abstractId);

    if (def) {
      def.value = options.concreteId;
    } else {

      // no previous default for this abstract service found, create a new one
      def = this.createElement(CREMATYPES.DEFAULT, {
        for: options.abstractId,
        value: options.concreteId
      });

      defaults.defaults.push(def);
    }

    return def;
  }


  /**
   * Removes service defaults definitions
   */
  public clearDefaults(options: IGetSetAnnotations): void {
    const defaults: ICremaDefaultCollection = this.getDefaults(options);
    if (defaults.defaults) {
      defaults.defaults.length = 0;
    }
  }

}



angular
  .module("cremaPDE.annotations")
  .service("serviceAnnotationsService", ServiceAnnotationsService)
  ;
