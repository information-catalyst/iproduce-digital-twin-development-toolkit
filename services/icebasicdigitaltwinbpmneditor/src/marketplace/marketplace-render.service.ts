import * as angular from "angular";

import * as serviceDTO from "./IServiceDTO";
import * as Annotations from "annotations";
import { IMarketplaceService } from "./marketplace.service";

import { IMsgBoxService } from "_common";

import {
  ICanvasService,
  IUpdateElementOptions,
  IModelingService,
  BPMNTYPES,
  IRegistryService
} from "../process-modeler";




export interface IMarketplaceRenderService {
  renderService(service: serviceDTO.IServiceDTO, pageX: number, pageY: number): void;
  splitInputOutput(stringToSplit: string): string[];
  splitPreconditionEffect(stringToSplit: string): string[];
  removeServiceImplementation(elementId: string): void;
  replaceServiceWith(service: serviceDTO.IServiceDTO, element: BpmnJS.IRegistryElement): void;
  getDefaults(): Annotations.ICremaDefault[];
}


export class MarketplaceRenderService implements IMarketplaceRenderService {
  static $inject = [
    "msgBoxService",
    "iopeAnnotationsService",
    "serviceAnnotationsService",
    "modelingService",
    "marketplaceService",
    "canvasService",
    "registryService"
  ];

  constructor(
    private _msgboxService: IMsgBoxService,
    private iopeAnnotations: Annotations.IIopeAnnotationsService,
    private serviceAnnotations: Annotations.IServiceAnnotationsService,
    private modelingService: IModelingService,
    private marketplaceService: IMarketplaceService,
    private canvasService: ICanvasService,
    private registryService: IRegistryService
  ) { }

  public isAbstractService(service: serviceDTO.IServiceDTO): boolean {
    return this.marketplaceService
      .isAbstractService(service);
  }

  /**
   * replaces an existing service with another one
   * @param {serviceDTO.IServiceDTO}  service new service that should replace the old one
   * @param {BpmnJS.IRegistryElement} element bpmn:element that corresponds to the old (and after replacing also the new) service
   */
  public replaceServiceWith(service: serviceDTO.IServiceDTO, element: BpmnJS.IRegistryElement): void {

    let abstractId = "";

    // get all service implementations that implements element
    const serviceImplementations: any = this.serviceAnnotations.getServiceImplementation(element);
    const serviceImplementation: any = serviceImplementations[0];

    // get abstractId of that service (abstractId of the service that should be replaced)
    if (serviceImplementation && serviceImplementation.abstractService && serviceImplementation.abstractService.marketplaceServiceID && serviceImplementation.abstractService.marketplaceServiceID.id) {
      abstractId = serviceImplementation.abstractService.marketplaceServiceID.id;
    }

    // create crema:default for abstract service <crema:default for="abstractId">concreteId</crema:default>
    const defaultOptions: Annotations.IGetSetDefaultExpression = {
      abstractId: abstractId,
      element: element.businessObject,
      create: true,
      concreteId: service.serviceID
    };

    this.serviceAnnotations.addDefault(defaultOptions);

    const serviceTasks: BpmnJS.IModdleElement[] = this.serviceAnnotations.getServiceTasksByServiceId(abstractId, "abstract");

    // update/replace crema service implementations and bpmn:serviceTask with new, concrete service values
    for (const task of serviceTasks) {

      const registryElement: BpmnJS.IRegistryElement = this.registryService.getElementById(task.id);
      const updateName: IUpdateElementOptions = {
        element: registryElement,
        propertyName: "name",
        propertyValue: service.name
      };

      this.modelingService.updateElement(updateName);

      // remove <crema:implementation> <crema:service> part of (old) service that should be replaced
      this.removeServiceImplementation(task.id); // WORKS

      // remove annotations inside bpmn:element
      this.removeServiceAnnotations(task);

      // add annotations of new service (that replaces the old one)
      this.annotateInputs(service.annotation.inputs, task);
      this.annotateOutputs(service.annotation.outputs, task);
      this.annotatePreconditions(service.annotation.preconditions, task);
      this.annotateEffects(service.annotation.effects, task);
      this.annotateService(service, task);
    }

    this._msgboxService.showSuccess(`Replaced ${serviceTasks.length} abstract instances with default`);
  }

  /**
   * splits an input/output annotation string (from MPM json) to url and name
   * @param  {string}   stringToSplit format: url :varname
   * @return {string[]}               [0] = url, [1] = name
   */
  public splitInputOutput(stringToSplit: string): string[] {
    // first split on space
    const splittedString: string[] = stringToSplit.split(" ");
    return splittedString;
  }

  /**
   * splits an precodition/effect annotation string (from MPM json) to url and name
   * @param  {string}   stringToSplit
   * @return {string[]}               [0] = url, [1] = name
   */
  public splitPreconditionEffect(stringToSplit: string): string[] {

    let splittedString: string[] = [];

    // get index of '('
    const index: number = stringToSplit.indexOf("(");
    if (index > -1) {
      // if string starts with '(http' - use new oderu parse
      if (stringToSplit.substring(0, 5) === "(http") {

        // PARSE BY NEW ODERU PRECONDITION/EFFECT SYNTAX
        const urlEndIndex: number = stringToSplit.indexOf(" ");
        if (urlEndIndex > -1) {
          const url: string = stringToSplit.substring(1, urlEndIndex);
          const name: string = stringToSplit.substring(urlEndIndex + 1, stringToSplit.length - 1);
          splittedString = [url, name];
          return splittedString;
        }
      }

      // name = '(' until end of string
      const name: string = stringToSplit.substring(index, stringToSplit.length);
      // url = everything before '('
      const url: string = stringToSplit.substring(0, index - 1);
      splittedString = [url, name];
    }

    return splittedString;

  }

  /**
   * removes <crema:service> inside <crema:implementation> that corresponds to a given bpmnTaskId
   * @param {string} elementId [description]
   */
  public removeServiceImplementation(elementId: string): void {
    this.serviceAnnotations.removeServiceImplementationByImplementsId(elementId);
  }

  public annotateInputs(inputData: serviceDTO.IInputs, element: BpmnJS.IModdleElement): void {

    for (const input of inputData.semantic) {
      for (const inputEntry of input) {

        //  output looks like http://www.crema-project.eu/DLP/UC1.owl#Time: Ti1
        //  split in url and name
        const splittedInput: string[] = this.splitInputOutput(inputEntry);
        const url: string = splittedInput[0];
        const name: string = splittedInput[1];

        const addInputOptions: Annotations.ICreateInputExpression = {
          element: element,
          create: true, // create all structure that is needed for input annotations
          name: name,
          concept: url
        };

        this.iopeAnnotations.addInput(addInputOptions);
      }
    }
  }

  public removeServiceAnnotations(element: BpmnJS.IModdleElement): void {
    this.iopeAnnotations.clearInputs(element);
    this.iopeAnnotations.clearOutputs(element);
    this.iopeAnnotations.clearPreconditions(element);
    this.iopeAnnotations.clearEffects(element);
  }

  public annotateOutputs(outputData: serviceDTO.IOutputs, element: BpmnJS.IModdleElement): void {

    for (const output of outputData.semantic) {
      for (const outputEntry of output) {
        //  output looks like http://www.crema-project.eu/DLP/UC1.owl#Time: Ti1
        //  split in url and name
        const splittedOutput: string[] = this.splitInputOutput(outputEntry);
        const url: string = splittedOutput[0];
        const name: string = splittedOutput[1];

        const addOutputOptions: Annotations.ICreateOutputExpression = {
          element: element,
          create: true, // create all structure that is needed for output annotations
          name: name,
          concept: url
        };

        this.iopeAnnotations.addOutput(addOutputOptions);
      }
    }
  }

  public annotatePreconditions(preconditionData: serviceDTO.IPreconditions, element: BpmnJS.IModdleElement): void {

    for (const precondition of preconditionData.parsedToArray) {

      const addPreconditionOptions: Annotations.ICreatePreconditionExpression = {
        element: element,
        create: true,
        multiple: preconditionData.parsedToArray.length > 1,
        value: precondition
      };

      this.iopeAnnotations.addPrecondition(addPreconditionOptions);
    }
  }

  public annotateEffects(effectData: serviceDTO.IEffects, element: BpmnJS.IModdleElement): void {
    // TODO: IF IT'S A RELATIONSSHIP, SURROUND WITH <crema:expr type="and">
    for (const effect of effectData.parsedToArray) {
      const addEffectOptions: Annotations.ICreateEffectExpression = {
        element: element,
        create: true,
        multiple: effectData.parsedToArray.length > 1,
        value: effect
      };

      this.iopeAnnotations.addEffect(addEffectOptions);
    }
  }

  public annotateService(service: serviceDTO.IServiceDTO, element: BpmnJS.IModdleElement): void {

    const addServiceImplementationOptions: Annotations.ICreateServiceImplementationExpression = {
      create: true,
      element: element,
      serviceId: service.serviceID,
      // if of corresponding bpmn:serviceTask
      implements: element.id,
    };

    if (this.isAbstractService(service)) {
      this.serviceAnnotations.addAbstractServiceImplementation(addServiceImplementationOptions);
    } else {
      this.serviceAnnotations.addConcreteServiceImplementation(addServiceImplementationOptions);
    }
  }

  public getDefaults(): Annotations.ICremaDefault[] {

    const defaultOptions: Annotations.IGetSetAnnotations = {
      element: null,
    };

    const defaults: Annotations.ICremaDefaultCollection = this.serviceAnnotations.getDefaults(defaultOptions);
    if (defaults && defaults.defaults) {
      return defaults.defaults;
    } else {
      return [];
    }
  }

  public renderService(service: serviceDTO.IServiceDTO, pageX: number, pageY: number): void {

    // TODO: CHECK, IF A DEFAULT IS SET FOR THE SERVICE
    // IF YES, REPLACE THE SERVICE WITH CONCRETE INSTANTLY
    // TODO: NOTIFY USER
    const defaultOptions: Annotations.IGetSetAnnotations = {
      element: null,
    };

    if (this.isAbstractService(service)) {

      const def = this.serviceAnnotations.getDefault(defaultOptions, service.serviceID);

      if (def && def.value) {

        this.marketplaceService
          .getService(def.value)
          .then((concreteService) => {

            // create new service by default (instead of creating abstract service, create default concrete service);
            // TODO: MAY BE NOTIFY USER ABOUT THIS
            this.createServiceElement(concreteService, pageX, pageY);

            console.log("created concreteService from default");
            this._msgboxService.showSuccess("Default found! Created default Concrete Service instead of Abstract Service.");

          }, () => {

            console.error(`concreteService ${def.value} could not be fetched, render abstract service instead`);
            this.createServiceElement(service, pageX, pageY);

          });

      } else {
        this.createServiceElement(service, pageX, pageY);
      }

    } else {
      // NOT AN ABSTRACT SERVICE, JUST CREATE IT
      this.createServiceElement(service, pageX, pageY);
    }
    // try to get a defaultConcreteId for this service

  }

  public createServiceElement(service: serviceDTO.IServiceDTO, pageX: number, pageY: number): void {

    const sidenavOffsetX = 0;
    const sidenavOffsetY = 0;

    // quick fix when PDE is loaded in dashboard (coordinates change)
    // detect if PDE loaded in <iframe>
    if (window.self !== window.top) {
      // alert("in dashboard");
      // sidenavOffsetX = -240;
      // sidenavOffsetY = 64;
    }

    const viewbox: BpmnJS.ICanvasViewBox = this.canvasService.getViewbox();
    const scaleFactor: number = 1 / viewbox.scale;
    const scaledX: number = pageX * scaleFactor;
    const scaledY: number = pageY * scaleFactor;
    const offsetX_base: number = 80 + sidenavOffsetX;
    const offsetY_base: number = 90 + sidenavOffsetY;
    const offsetX: number = offsetX_base * scaleFactor;
    const offsetY: number = offsetY_base * scaleFactor;
    const x: number = scaledX + offsetX + viewbox.x;
    const y: number = scaledY - offsetY + viewbox.y;

    // create element with camunda properties in one shoot, to support undo/redo
    this.modelingService.createElement({
      x: x,
      y: y,
      type: BPMNTYPES.SERVICE_TASK,
      onCreating: (createdServiceRegistryElement: BpmnJS.IRegistryElement) => {

        // businessObject of createdServiceRegistryElement, used for annotations
        const createdServiceElement: BpmnJS.IModdleElement = createdServiceRegistryElement.businessObject;
        // set camunda properties
        createdServiceElement.set("name", service.name);
        createdServiceElement.set("camunda:type", "external");
        createdServiceElement.set("camunda:topic", "CremaServiceExecution");

        // add crema-specific service annotations to bpmn:serviceTask
        this.annotateInputs(service.annotation.inputs, createdServiceElement);
        this.annotateOutputs(service.annotation.outputs, createdServiceElement);
        this.annotatePreconditions(service.annotation.preconditions, createdServiceElement);
        this.annotateEffects(service.annotation.effects, createdServiceElement);
        this.annotateService(service, createdServiceElement);

      }
    });
  }



}

angular
  .module("cremaPDE.marketplace")
  .service("marketplaceRenderService", MarketplaceRenderService)
  ;
