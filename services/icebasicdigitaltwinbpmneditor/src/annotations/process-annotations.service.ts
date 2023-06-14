import * as angular from "angular";

import { IModdleService, ICanvasService } from "../process-modeler";
import { CREMATYPES } from "./crema-types";
import {
  IGetSetAnnotations,
  ICremaProcess,
  ICremaProcessExtensions,
  ICremaMetadata,
  ICremaOptimization,
  ICremaFormulation
} from "./common";


export interface ISetOptimisationFormulation extends IGetSetAnnotations {
  formulation?: string;
}

/**
 * Annotations management at process level
 */
export interface IProcessAnnotationsService {

  /**
   * Get root process crema business object
   */
  getRootProcess(): ICremaProcess;

  /**
   * Get root process metadata annotations
   */
  getProcessMetadata<T>(options: IGetSetAnnotations): ICremaMetadata;

  /**
   * Get root process optimization formulation
   */
  getOptimizationFormulation(options: IGetSetAnnotations): ICremaFormulation;

  /**
   * Sets root process optimization formulation
   */
  setOptimizationFormulation(options: ISetOptimisationFormulation): void;

}


class ProcessAnnotationsService implements IProcessAnnotationsService {

  static $inject = [
    "moddleService",
    "canvasService",
  ];

  constructor(
    private _moddleService: IModdleService,
    private _canvasService: ICanvasService
  ) {
  }

  /**
   * Create business object using moddle service
   */
  private createElement($type: string, props?: any): any {
    return this._moddleService.createElement($type, props);
  }

  /**
   * Get root process crema business object
   */
  public getRootProcess(): ICremaProcess {
    return this._canvasService.getRootElement().businessObject;
  }


  /**
   * Get root process metadata annotations
   */
  public getProcessMetadata<T>(options: IGetSetAnnotations): ICremaMetadata {

    if (!options.element) {
      options.element = this.getRootProcess();
    }

    const extensions: ICremaProcessExtensions = options.element.extensionElements ||
      this._moddleService.getExtensions<T>(options.element, options.create);

    if (extensions == null) {
      return null;
    }

    if (options.create && extensions.values.length === 0) {
      extensions.values.push(this.createElement(CREMATYPES.METADATA));
    }
    return extensions.values[0];
  }


  /**
   * Get optimization annotation object
   */
  private getOptimization(options: IGetSetAnnotations): ICremaOptimization {

    const metadata: ICremaMetadata = this.getProcessMetadata(options);
    if (!options.create) {
      return metadata && metadata.optimization || null;
    }

    if (!metadata.optimization) {
      metadata.optimization = this.createElement(CREMATYPES.OPTIMIZATION);
    }

    return metadata.optimization;
  }

  /**
   * Gets root process optimization formulation
   */
  public getOptimizationFormulation(options: IGetSetAnnotations): ICremaFormulation {

    const optimization: ICremaOptimization = this.getOptimization(options);
    if (!options.create) {
      return optimization && optimization.formulation || null;
    }

    if (!optimization.formulation) {
      optimization.formulation = this.createElement(CREMATYPES.FORMULATION);
    }

    return optimization.formulation;
  }

  /**
   * Sets root process optimization formulation
   */
  public setOptimizationFormulation(options: ISetOptimisationFormulation): void {

    options.create = true;
    const formulation: ICremaFormulation = this.getOptimizationFormulation(options);
    formulation.value = options.formulation;
  }


}



angular
  .module("cremaPDE.annotations")
  .service("processAnnotationsService", ProcessAnnotationsService)
  ;
