/**
 * purpose of this service is to sync marketplace service instances inside process models
 * with updated service data from the marketplace
 */
import * as angular from "angular";
import { IManagerService } from "_core";
import { IServiceAnnotationsService, IIopeAnnotationsService, ICremaServiceImplementation } from "annotations";
import { IServiceDTO } from "marketplace/IServiceDTO";
import { IMarketplaceService } from "marketplace";
import { IRegistryService, IUpdateElementOptions, IModelingService } from "process-modeler";

interface IServiceDetails {
  $type: string;
  marketplaceServiceID?: {
    $type: string;
    id: string;
  };
}

export interface IServiceImplementation {
  $type: string;
  implements: string;
  seq: number;
  abstractService: IServiceDetails;
  concreteService: IServiceDetails;
}

export interface IOutdatedService {
  mpmService: IServiceDTO;
  serviceTasks: BpmnJS.IModdleElement[];
  reason: "outOfDate" | "deleted";
}

export interface IMarketplaceSyncService {
  getCachedServices(): ng.IPromise<IServiceDTO[]>;
  checkProcessForOutdatedServices(): void;
  getServiceByServiceId(serviceId: string): IServiceDTO;
}

export class MarketplaceSyncService implements IMarketplaceSyncService {
  static $inject = [
    "$q", "$uibModal", "managerService",
    "marketplaceService", "iopeAnnotationsService",
    "serviceAnnotationsService", "registryService",
    "modelingService"
  ];
  public services: IServiceDTO[];
  public outdatedServices: IOutdatedService[];
  public checkedModels: any[] = [];
  public currentModel: any;
  constructor(
    private $q: ng.IQService,
    private $uibModal: ng.ui.bootstrap.IModalService,
    private managerService: IManagerService,
    private marketplaceService: IMarketplaceService,
    private iopeAnnotationsService: IIopeAnnotationsService,
    private serviceAnnotationsService: IServiceAnnotationsService,
    private registryService: IRegistryService,
    private modelingService: IModelingService
  ) {
    this.getCachedServices(); // TODO: REMOVE
    this.managerService.onSelectedChanged(() => {
      // this.currentModel = this.managerService.getModel();
      // if (!this.processChecked()) {
      //   this.checkProcessForOutdatedServices();
      // }
    });
  }
  /**
   * open sync modal, asking user for action
   * if some services of PM are out of sync with MPM
   */
  openSyncModal() {
    this.$uibModal.open({
      component: "pdeMarketplaceSyncModal",
      size: "md"
    }).result
      .then(result => {
        if (result === "clone") {
          this.cloneProcess();
        }
      })
      .catch(angular.noop);
  }

  cloneProcess() {
    // TODO: first update, then clone
    const clonedProcess = { ...this.currentModel };
    delete clonedProcess._id;
    delete clonedProcess.$$hashKey;
    clonedProcess.lastModified = new Date();
    clonedProcess.processName = this.currentModel.processName + " (updated)";
    this.managerService.openModel(clonedProcess);
    console.log(clonedProcess);
  }
  /**
   * get marketplace services, caching for later checks
   */
  getCachedServices(): ng.IPromise<IServiceDTO[]> {
    const deferred: ng.IDeferred<IServiceDTO[]> = this.$q.defer();
    if (!this.services) {
      this.marketplaceService.getServices()
        .then(services => {
          this.services = services as IServiceDTO[];
          deferred.resolve(services as IServiceDTO[]);
        });
    } else {
      deferred.resolve(this.services);
    }
    return deferred.promise;
  }
  /**
   * get mpm service based on serviceID
   * from cached services (this.services)
   * @param  {string}      serviceId
   * @return {IServiceDTO}
   */
  getServiceByServiceId(serviceId: string): IServiceDTO {
    if (this.services && this.services.length > 0) {
      for (const service of this.services) {
        if (service.serviceID === serviceId) {
          return service;
        }
      }
    }
    return null;
  }

  /**
   * checks if the current model was already checked in the current session
   * uses angulars $$hashKey property for storing already checked process tabs
   * reason to not use id is that closed and again opened processes should again
   * checked for updated services
   * @return {boolean} [description]
   */
  processChecked(): boolean {
    // this.openSyncModal();
    if (!this.currentModel) {
      return true;
    }
    if (this.checkedModels.indexOf(this.currentModel.$$hashKey) !== -1) {
      return true;
    } else {
      this.checkedModels.push(this.currentModel.$$hashKey);
      return false;
    }
  }

  /**
   * check a PM for outdated services
   * and store them in this.outdatedServices
   */
  checkProcessForOutdatedServices() {
    this.outdatedServices = [];
    this.getCachedServices()
      .then(services => {
        try {
          // <crema:implementation>
          const implementations: IServiceImplementation[] = this.serviceAnnotationsService.getServiceImplementations({ element: null }) as any;
          if (implementations && implementations.length > 0) {
            for (const impl of implementations) {
              this.implementedServiceOutOfSync(impl);
            }
          }
          if (this.outdatedServices.length > 0) {
            alert("PROCESS IS OUTDATED");
            console.log(this.outdatedServices);
          }
        }
        catch (e) { }
      });
  }

  updatedProcessModel() {
    for (const oodService of this.outdatedServices) {
      if (oodService.reason === "outOfDate") {
        for (const task of oodService.serviceTasks) {
          const registryElement: BpmnJS.IRegistryElement = this.registryService.getElementById(task.id);
          const updateName: IUpdateElementOptions = {
            element: registryElement,
            propertyName: "name",
            propertyValue: oodService.mpmService.name
          };

          this.modelingService.updateElement(updateName);
        }
      }

      if (oodService.reason === "deleted") {
        // TODO: perform service is deleted action
        // TODO: just remove it?
      }

    }
  }
  /**
   * compare an implemented service from PM with service from MPM
   * @param impl service implementation of PM
   * @return true if services out of sync
   */
  implementedServiceOutOfSync(impl: IServiceImplementation): boolean {
    const serviceId = this.serviceAnnotationsService.getServiceIdByImplementation(impl);
    const mpmService = this.getServiceByServiceId(serviceId);
    if (!mpmService) {
      this.outdatedServices.push({
        mpmService: null,
        serviceTasks: this.serviceAnnotationsService.getServiceTasksByServiceId(serviceId),
        reason: "deleted"
      });
      return false;
    }
    // <bpmn:serviceTask implements='serviceID'>
    const serviceTasks = this.serviceAnnotationsService.getServiceTasksByServiceId(serviceId);
    for (const element of serviceTasks) {
      const inputsOutOfSync = this.inputsOutOfSync(element, mpmService);
      const outputsOutOfSync = this.outputsOutOfSync(element, mpmService);
      const precOutOfSync = this.preconditionsOutOfSync(element, mpmService);
      const effOutOfSync = this.effectsOutOfSync(element, mpmService);
      console.log(inputsOutOfSync, outputsOutOfSync, precOutOfSync, effOutOfSync);
      if (inputsOutOfSync || outputsOutOfSync || precOutOfSync || effOutOfSync) {
        this.outdatedServices.push({
          mpmService: mpmService,
          serviceTasks: serviceTasks,
          reason: "outOfDate"
        });
      }
    }
  }
  /**
   * compares input annotations of a marketplace service
   * with the input annotations of a bpmnServiceTask
   * @param  {BpmnJS.IModdleElement} element    the <bpmn:serviceTask>
   * @param  {IServiceDTO}           mpmService marketplace service
   * @return {boolean}
   */
  inputsOutOfSync(element: BpmnJS.IModdleElement, mpmService: IServiceDTO): boolean {
    const serviceHasInputs = mpmService.annotation && mpmService.annotation.inputs && mpmService.annotation.inputs.semantic && mpmService.annotation.inputs.semantic.length > 0;
    if (!serviceHasInputs) {
      return false;
    }
    const serviceInputs = mpmService.annotation.inputs.semantic;
    const implementedInputs = this.iopeAnnotationsService.getInputAnnotations({ element });
    for (let i = 0, len = serviceInputs.length; i < len; i++) {
      if (serviceInputs[i][0] !== implementedInputs[i].element.value + " " + implementedInputs[i].element.name) {
        return true;
      }
    }
    return false;
  }
  /**
   * compares output annotations of a marketplace service
   * with the output annotations of a bpmnServiceTask
   * @param  {BpmnJS.IModdleElement} element    the <bpmn:serviceTask>
   * @param  {IServiceDTO}           mpmService marketplace service
   * @return {boolean}
   */
  outputsOutOfSync(element: BpmnJS.IModdleElement, mpmService: IServiceDTO): boolean {
    const serviceHasOutputs = mpmService.annotation && mpmService.annotation.outputs && mpmService.annotation.outputs.semantic && mpmService.annotation.outputs.semantic.length > 0;
    if (!serviceHasOutputs) {
      return false;
    }
    const serviceOutputs = mpmService.annotation.outputs.semantic;
    const implementedOutputs = this.iopeAnnotationsService.getOutputAnnotations({ element });
    for (let i = 0, len = serviceOutputs.length; i < len; i++) {
      if (serviceOutputs[i][0] !== implementedOutputs[i].element.value + " " + implementedOutputs[i].element.name) {
        return true;
      }
    }
    return false;
  }
  /**
   * compares precondition annotations of a marketplace service
   * with the precondition annotations of a bpmnServiceTask
   * @param  {BpmnJS.IModdleElement} element    the <bpmn:serviceTask>
   * @param  {IServiceDTO}           mpmService marketplace service
   * @return {boolean}
   */
  preconditionsOutOfSync(element: BpmnJS.IModdleElement, mpmService: IServiceDTO): boolean {
    const serviceHasPrec = mpmService.annotation && mpmService.annotation.preconditions && mpmService.annotation.preconditions.semantic && mpmService.annotation.preconditions.semantic.length > 0;
    if (!serviceHasPrec) {
      return false;
    }
    const servicePrec = mpmService.annotation.preconditions.parsedToArray;
    const implementedPrec = this.iopeAnnotationsService.getPreconditionAnnotations({ element });
    if (servicePrec.length > 1) {
      if (!implementedPrec.expr || !implementedPrec.expr.element || implementedPrec.expr.element.length !== servicePrec.length) {
        return true;
      }
      for (let i = 0, len = servicePrec.length; i < len; i++) {
        if (servicePrec[i] !== implementedPrec.expr.element[i].value) {
          return true;
        }
      }
    } else {
      if (servicePrec[0] !== implementedPrec.element[0].value) {
        return true;
      }
    }
    return false;
  }
  /**
   * compares effect annotations of a marketplace service
   * with the effect annotations of a bpmnServiceTask
   * @param  {BpmnJS.IModdleElement} element    the <bpmn:serviceTask>
   * @param  {IServiceDTO}           mpmService marketplace service
   * @return {boolean}
   */
  effectsOutOfSync(element: BpmnJS.IModdleElement, mpmService: IServiceDTO): boolean {
    const serviceHasEffects = mpmService.annotation && mpmService.annotation.effects && mpmService.annotation.effects.semantic && mpmService.annotation.effects.semantic.length > 0;
    if (!serviceHasEffects) {
      return false;
    }
    const serviceEff = mpmService.annotation.effects.parsedToArray;
    const implementedEff = this.iopeAnnotationsService.getEffectAnnotations({ element });
    if (serviceEff.length > 1) {
      if (!implementedEff.expr || !implementedEff.expr.element || implementedEff.expr.element.length !== serviceEff.length) {
        return true;
      }
      for (let i = 0, len = serviceEff.length; i < len; i++) {
        if (serviceEff[i] !== implementedEff.expr.element[i].value) {
          return true;
        }
      }
    } else {
      if (serviceEff[0] !== implementedEff.element[0].value) {
        return true;
      }
    }
    return false;
  }
}


angular
  .module("cremaPDE.marketplace")
  .service("marketplaceSyncService", MarketplaceSyncService)
  ;
