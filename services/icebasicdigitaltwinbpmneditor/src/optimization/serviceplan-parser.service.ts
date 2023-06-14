import * as angular from "angular";

import { IProcessModeler } from "_core";
import { IXmlParserService, IXmlParseResult, IRegistryService } from "../process-modeler";
import * as Annotations from "annotations";



export interface IServicePlanDetail {
  changes: IServicePlanChangeDetail[];
  xml: string;
}

export interface IServicePlanOptimization {
  functional: string;
  nonFunctional: string;
  dimensions: IOptimizationDimension[];
}

export interface IOptimizationDimension {
  name: string;
  value: any;
}

export interface IServicePlanChangeDetail {
  implementation: IServiceImplementation;
  element: BpmnJS.IRegistryElement;
  id: string;
}

export interface IServiceImplementation {
  abstract: IAbstractServiceImplementation;
  concretes: IConcreteServiceImplementation[];
  isFromOptimization: boolean;
  seq: number;
  usable: boolean;
}

export interface IAbstractServiceImplementation {
  marketplaceServiceId: string;
}

export interface IConcreteServiceImplementation {
  marketplaceServiceId: string;
  owlsDescription: string;
  assignments: IServiceAssignment[];
  bindings: IServiceBinding[];
}

export interface IServiceAssignment {
  for: string;
  name: string;
  value: any;
}

export interface IServiceBinding {
  origin: IServiceBindingDef;
  target: IServiceBindingDef;
}


export interface IServiceBindingDef {
  env?: boolean;
  service?: string;
  name?: string;
}




export interface IServicePlanParserService {

  /**
   * Parse service plan xml into displayable structure
   */
  parsePlanDetail(xml: string, modeler: IProcessModeler): ng.IPromise<IServicePlanDetail>;
}



class ServicePlanParserService implements IServicePlanParserService {

  static ODERU_JSON_SCHEMA: string = require("./data/oderu.json");


  static $inject = [
    "$q",
    "xmlParserService",
    "registryService",
    "serviceAnnotationsService"
  ];

  constructor(
    private $q: ng.IQService,
    private xmlParserService: IXmlParserService,
    private registryService: IRegistryService,
    private annotationsService: Annotations.IServiceAnnotationsService
  ) {
    // super(utilService);
  }



  /**
   * Parse service plan xml into displayable structure
   */
  public parsePlanDetail(xml: string, modeler: IProcessModeler): ng.IPromise<IServicePlanDetail> {
    return this.$q((resolve, reject) => {

      if (!xml || !xml.length) {
        return reject("Xml Model is empty");
      }

      const moddlePackages: any = {
        crema: ServicePlanParserService.ODERU_JSON_SCHEMA
      };

      return this.xmlParserService
        .parseXML(moddlePackages, xml)
        .then((data) => {
          return resolve(this.flattenServicePlan(data, modeler));

        })
        .catch(() => {
          return reject();
        });
    });
  }

  /**
   * Simplify service plan structure for easier display
   */
  private flattenServicePlan(data: IXmlParseResult, modeler: IProcessModeler): IServicePlanDetail {

    const rootProcess: Annotations.ICremaProcess = data.definitions.rootElements[0];

    // flatten values
    const planDetail: IServicePlanDetail = {
      changes: [],
      xml: data.xml
    };

    this.flattenImplementations(planDetail, modeler, rootProcess);
    return planDetail;

  }

  /**
   * Simplify service plan implementations structure
   */
  private flattenImplementations(planDetail: IServicePlanDetail, modeler: IProcessModeler, rootProcess: Annotations.ICremaProcess): void {
    const impls: Annotations.ICremaServiceImplementation[] = this.annotationsService.getServiceImplementations({ element: rootProcess });
    impls.forEach((impl) => {
      const id: string = this.annotationsService.getServiceImplementationId(impl);
      const element = this.registryService.getElementById(id);

      if (!element) {
        return;
      }

      // create detail
      planDetail.changes.push({

        element: element,
        implementation: {

          abstract: {
            marketplaceServiceId: impl.abstractService && impl.abstractService.marketplaceServiceID ? impl.abstractService.marketplaceServiceID.id : "",
          },

          isFromOptimization: impl.concreteService.origin.toLowerCase() === "designer" ? false : true,

          concretes: impl.concreteService.marketplaceServiceID.map((m) => {

            return <IConcreteServiceImplementation>{
              marketplaceServiceId: m.id,
              owlsDescription: impl.concreteService.owlsDescription,
              assignments: !(impl.concreteService.assignments && impl.concreteService.assignments.values) ? [] :
                impl.concreteService.assignments.values.map((a) => {

                  return {
                    name: a.name,
                    value: a.value,
                    for: a.for,
                  };

                }),
              bindings: !(impl.concreteService.bindings && impl.concreteService.bindings.values) ? [] :
                impl.concreteService.bindings.values.map((b) => {

                  return {
                    origin: b.origin ? {
                      env: b.origin.env != null ? true : false,
                      service: b.origin.variable ? b.origin.variable.service : null,
                      name: b.origin.variable ? b.origin.variable.name : null,
                    } : null,
                    target: b.target ? {
                      service: b.target.variable ? b.target.variable.service : null,
                      name: b.target.variable ? b.target.variable.name : null,
                    } : null
                  };

                }),
            };

          }),

          seq: impl.seq,
          usable: impl.usable,

        },

        id: id
      });

    });

  }
}


angular
  .module("cremaPDE.optimization")
  .service("servicePlanParserService", ServicePlanParserService)
  ;
