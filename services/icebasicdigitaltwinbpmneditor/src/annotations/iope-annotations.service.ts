import * as angular from "angular";

import { IBpmnTypesService, IModdleService } from "../process-modeler";

import { CREMATYPES } from "./crema-types";
import { IProcessAnnotationsService } from "./process-annotations.service";

import {
  IGetSetAnnotations,
  ICremaMetadata,
  ICremaAnnotations,
  ICremaInputExpression,
  ICremaOutputExpression,
  ICremaPreconditionCollection,
  ICremaElement,
  ICremaExpression,
  ICremaEffectCollection,
  ICremaServiceExtensions
} from "./common";

/**
 * Object used for creating a single input expression
 */
export interface ICreateInputExpression extends IGetSetAnnotations {

  /**
   * Input name
   */
  name: string;

  /**
   * Input Uri concept
   */
  concept: string;
}


/**
 * Object used for creating a single input expression
 */
export interface ICreateInputExpressions extends IGetSetAnnotations {
  name: string;
  concept: string;
}


export interface ICreateOutputExpression extends IGetSetAnnotations {
  name: string;
  concept: string;
}

export interface ICreatePreconditionExpression extends IGetSetAnnotations {
  value: string;
  multiple?: boolean;
}

export interface IGetPreconditions extends IGetSetAnnotations {
  multiple?: boolean;
}

export interface IGetEffects extends IGetSetAnnotations {
  multiple?: boolean;
}

export interface ICreateEffectExpression extends IGetSetAnnotations {
  value: string;
  multiple?: boolean;
}


export interface IIopeAnnotationsService {

  canHaveAnnotations(element: IRegistryElement | IModdleElement): boolean;

  getInputAnnotations(options: IGetSetAnnotations): ICremaInputExpression[];

  /**
   * Returns true if the given element has all inputs/outputs annotations set
   */
  hasAllInputsOutputsConnected(element: IRegistryElement): boolean;

  addInput(options: ICreateInputExpression): ICremaInputExpression;
  removeInputAt(element: BpmnJS.IModdleElement, index: number): void;
  clearInputs(element: BpmnJS.IModdleElement): void;

  getOutputAnnotations(options: IGetSetAnnotations): ICremaOutputExpression[];
  addOutput(options: ICreateOutputExpression): ICremaInputExpression;
  removeOutputAt(element: BpmnJS.IModdleElement, index: number): void;
  clearOutputs(element: BpmnJS.IModdleElement): void;

  getPreconditionAnnotations(options: IGetSetAnnotations): ICremaPreconditionCollection;
  addPrecondition(options: ICreatePreconditionExpression): ICremaElement | ICremaExpression;
  removePreconditionAt(element: BpmnJS.IModdleElement, index: number, multiple?: boolean): void;
  clearPreconditions(element: BpmnJS.IModdleElement): void;

  getEffectAnnotations(options: IGetSetAnnotations): ICremaEffectCollection;
  addEffect(options: ICreateEffectExpression): ICremaElement | ICremaExpression;
  removeEffectAt(element: BpmnJS.IModdleElement, index: number, multiple?: boolean): void;
  clearEffects(element: BpmnJS.IModdleElement): void;

}




class IopeAnnotationsService implements IIopeAnnotationsService {

  static $inject = [
    "moddleService",
    "bpmnTypesService",
    "processAnnotationsService"
  ];
  constructor(
    private _moddleService: IModdleService,
    private _bpmnTypesService: IBpmnTypesService,
    private _processAnnotations: IProcessAnnotationsService
  ) {
  }


  /**
   * Create business object using moddle service
   */
  private createElement($type: string, props?: any): any {
    return this._moddleService.createElement($type, props);
  }


  // ensures crema:annotations either at process level or service level
  private getAnnotations(options: IGetSetAnnotations): ICremaAnnotations {

    return this._bpmnTypesService.isProcess(options.element) ?
      this.getProcessAnnotations(options) :
      this.getServiceAnnotations(options);
  }

  // ensures crema:annotations at process level exists, otherwise it creates it
  private getProcessAnnotations(options: IGetSetAnnotations): ICremaAnnotations {

    const metadata: ICremaMetadata = this._processAnnotations.getProcessMetadata(options);
    if (metadata == null) {
      return null;
    }

    if (!metadata.annotations) {
      metadata.annotations = this.createElement(CREMATYPES.ANNOTATIONS);
    }
    return metadata.annotations;

  }

  // ensures crema:annotations at service level exists, otherwise it creates it
  private getServiceAnnotations(options: IGetSetAnnotations): ICremaAnnotations {

    const extensions: ICremaServiceExtensions = options.element.extensionElements ||
      this._moddleService.getExtensions(options.element, options.create);

    if (extensions == null) {
      return null;
    }

    let annotationsMissing = true;
    let index = -1;

    for (const val of extensions.values) {
      if (val.$type === CREMATYPES.ANNOTATIONS) {
        annotationsMissing = false;
        index = extensions.values.indexOf(val);
      }
    }

    if (options.create && annotationsMissing) {
      extensions.values.push(this.createElement(CREMATYPES.ANNOTATIONS));
      index = extensions.values.length - 1;
    }
    return extensions.values[index] as ICremaAnnotations;
  }


  public canHaveAnnotations(element: IRegistryElement | IModdleElement): boolean {
    // TODO: use bpmn type service
    return this._bpmnTypesService.isServiceTask(element);
  }


  // ensures crema:inputs
  public getInputAnnotations(options: IGetSetAnnotations): ICremaInputExpression[] {

    const annotations: ICremaAnnotations = this.getAnnotations(options);
    if (annotations == null) {
      return null;
    }

    if (options.create && !annotations.inputs) {
      annotations.inputs = this.createElement(CREMATYPES.INPUTS);
    }

    if (options.create && !annotations.inputs.input) {
      annotations.inputs.input = [];
    }

    return annotations && annotations.inputs && annotations.inputs.input || null;
  }


  /**
   * Returns true if the given element has all inputs/outputs annotations set
   */
  public hasAllInputsOutputsConnected(element: IRegistryElement): boolean {

    const inputs = this.getInputAnnotations({ element: element.businessObject });
    const outputs = element.incoming && element.incoming.length ? this.getOutputAnnotations({ element: element.incoming[0].source }) : null;
    return inputs && inputs.length && outputs && outputs.length && outputs.length === inputs.length;
  }


  public addInput(options: ICreateInputExpression): ICremaInputExpression {

    const inputs: ICremaInputExpression[] = this.getInputAnnotations(options);
    const element: ICremaElement = this.createElement(CREMATYPES.ELEMENT, {
      name: options.name,
      value: options.concept
    });

    const input: ICremaInputExpression = this.createElement(CREMATYPES.INPUT, {
      element: element
    });

    inputs.push(input);
    return input;
  }


  public removeInputAt(element: BpmnJS.IModdleElement, index: number): void {

    const inputs: ICremaInputExpression[] = this.getInputAnnotations({
      element: element
    });

    if (inputs) {
      inputs.splice(index, 1);
    }
  }


  public clearInputs(element: BpmnJS.IModdleElement): void {

    const inputs: ICremaInputExpression[] = this.getInputAnnotations({
      element: element
    });

    if (inputs) {
      inputs.length = 0;
    }
  }


  // ensures crema:outputs
  public getOutputAnnotations(options: IGetSetAnnotations): ICremaOutputExpression[] {

    const annotations: ICremaAnnotations = this.getAnnotations(options);
    if (annotations == null) {
      return null;
    }
    if (options.create && !annotations.outputs) {
      annotations.outputs = this.createElement(CREMATYPES.OUTPUTS);
    }

    if (options.create && !annotations.outputs.output) {
      annotations.outputs.output = [];
    }
    return annotations && annotations.outputs && annotations.outputs.output || null;
  }


  public addOutput(options: ICreateOutputExpression): ICremaOutputExpression {
    const outputs: ICremaOutputExpression[] = this.getOutputAnnotations(options);
    const element: ICremaElement = this.createElement(CREMATYPES.ELEMENT, {
      name: options.name,
      value: options.concept
    });

    const output: ICremaOutputExpression = this.createElement(CREMATYPES.OUTPUT, {
      element: element
    });

    outputs.push(output);
    return output;
  }


  public removeOutputAt(element: BpmnJS.IModdleElement, index: number): void {
    const outputs: ICremaOutputExpression[] = this.getOutputAnnotations({
      element: element
    });

    if (outputs) {
      outputs.splice(index, 1);
    }
  }


  public clearOutputs(element: BpmnJS.IModdleElement): void {

    const outputs: ICremaOutputExpression[] = this.getOutputAnnotations({
      element: element
    });

    if (outputs) {
      outputs.length = 0;
    }
  }

  public getPreconditionAnnotations(options: IGetPreconditions): ICremaPreconditionCollection {
    const annotations: ICremaAnnotations = this.getAnnotations(options);
    if (annotations == null) {
      return null;
    }
    if (options.create && !annotations.preconditions) {
      annotations.preconditions = this.createElement(CREMATYPES.PRECONDITIONS);
    }

    if (options.create && !annotations.preconditions.element) {
      annotations.preconditions.element = [];
    }

    if (options.create && options.multiple && !annotations.preconditions.expr) {
      annotations.preconditions.expr = this.createElement(CREMATYPES.EXPR, {
        type: "and"
      });
      annotations.preconditions.expr.element = [];
    }

    return annotations && annotations.preconditions || null;
  }

  public addPrecondition(options: ICreatePreconditionExpression): ICremaElement | ICremaExpression {
    // TODO: maybe it's necessary surround the <crema:element> with <crema:expr type="and"> if name consists of 2 constiables
    const preconditions: ICremaPreconditionCollection = this.getPreconditionAnnotations(options);

    const element: ICremaElement = this.createElement(CREMATYPES.ELEMENT, {
      value: options.value
    });
    // add to element array
    if (options.multiple) {
      preconditions.expr.element.push(element);
    } else {
      preconditions.element.push(element);
    }
    return element;
  }

  // multiple should be true, if element is inside an <crema:expr>
  public removePreconditionAt(element: BpmnJS.IModdleElement, index: number, multiple?: boolean): void {
    const preconditions: ICremaPreconditionCollection = this.getPreconditionAnnotations({
      element: element
    });

    if (preconditions && preconditions.element && !multiple) {
      preconditions.element.splice(index, 1);
    } else if (preconditions && preconditions.expr && multiple) {
      preconditions.expr.element.splice(index, 1);
    }
  }

  public clearPreconditions(element: BpmnJS.IModdleElement): void {
    const preconditions: ICremaPreconditionCollection = this.getPreconditionAnnotations({
      element: element
    });

    if (preconditions) {
      if (preconditions.element) {
        preconditions.element.length = 0;
      }
      if (preconditions.expr) {
        delete preconditions.expr;
        // preconditions.expr.element.length = 0;
      }
    }
  }

  public getEffectAnnotations(options: IGetEffects): ICremaEffectCollection {
    const annotations: ICremaAnnotations = this.getAnnotations(options);
    if (annotations == null) {
      return null;
    }
    if (options.create && !annotations.effects) {
      annotations.effects = this.createElement(CREMATYPES.EFFECTS);
    }

    if (options.create && !annotations.effects.element) {
      annotations.effects.element = [];
    }

    if (options.create && options.multiple && !annotations.effects.expr) {
      annotations.effects.expr = this.createElement(CREMATYPES.EXPR, {
        type: "and"
      });
      annotations.effects.expr.element = [];
    }

    return annotations && annotations.effects || null;
  }

  public addEffect(options: ICreateEffectExpression): ICremaElement | ICremaExpression {
    const effects: ICremaEffectCollection = this.getEffectAnnotations(options);
    const element: ICremaElement = this.createElement(CREMATYPES.ELEMENT, {
      value: options.value
    });

    // add to element array
    if (options.multiple) {
      effects.expr.element.push(element);
    } else {
      effects.element.push(element);
    }


    return element;
  }

  // multiple should be true, if element is inside an <crema:expr>
  public removeEffectAt(element: BpmnJS.IModdleElement, index: number, multiple?: boolean): void {
    const effects: ICremaEffectCollection = this.getEffectAnnotations({
      element: element
    });

    if (effects && effects.element && !multiple) {
      effects.element.splice(index, 1);
    } else if (effects && effects.expr && multiple) {
      effects.expr.element.splice(index, 1);
    }
  }

  public clearEffects(element: BpmnJS.IModdleElement): void {
    const effects: ICremaEffectCollection = this.getEffectAnnotations({
      element: element
    });

    if (effects) {
      if (effects.element) {
        effects.element.length = 0;
      }
      if (effects.expr) {
        delete effects.expr;
        // effects.expr.element.length = 0;
      }
    }
  }

}



angular
  .module("cremaPDE.annotations")
  .service("iopeAnnotationsService", IopeAnnotationsService)
  ;
