import * as angular from "angular";
import { IGetSetAnnotations, ICremaConstantExpression, ICremaServiceExtensions, ICremaConstantCollection, ICremaElement } from "annotations";
import { IModdleService } from "process-modeler";
import { CREMATYPES } from "annotations/crema-types";

export interface ICreateConstantExpression extends IGetSetAnnotations {
  variable: string;
  value: string;
}

export interface IConstantAnnotationsService {
  addConstant(options: ICreateConstantExpression): ICremaConstantExpression;
  getServiceConstants(options: IGetSetAnnotations): ICremaConstantCollection;
  removeConstantAt(element: BpmnJS.IModdleElement, index: number): void;
}

class ConstantAnnotationsService {
  static $inject = ["moddleService"];
  constructor(
    private moddleService: IModdleService
  ) {
    //
  }

  public addConstant(options: ICreateConstantExpression): ICremaConstantExpression {
    const constants: ICremaConstantCollection = this.getServiceConstants(options);

    if (options.create && !constants.constant) {
      constants.constant = [];
    }

    const element: ICremaElement = this.createElement(CREMATYPES.ELEMENT, {
      variable: options.variable,
      value: options.value
    });

    const constant: ICremaConstantExpression = this.createElement(CREMATYPES.CONSTANT, {
      element: element
    });

    constants.constant.push(constant);
    return constant;
  }

  public clearConstants(element: BpmnJS.IModdleElement): void {

    const constants: ICremaConstantCollection = this.getServiceConstants({
      element: element
    });

    if (constants) {
      constants.constant.length = 0;
    }
  }

  public removeConstantAt(element: BpmnJS.IModdleElement, index: number): void {
    const constants: ICremaConstantCollection = this.getServiceConstants({
      element: element
    });

    if (constants) {
      constants.constant.splice(index, 1);
    }
  }
  //
  private getServiceConstants(options: IGetSetAnnotations): ICremaConstantCollection {
    const extensions: ICremaServiceExtensions = options.element.extensionElements ||
      this.moddleService.getExtensions(options.element, options.create);

    if (extensions == null) {
      return null;
    }

    let constantsMissing = true;
    let index = -1;

    for (const val of extensions.values) {
      if (val.$type === CREMATYPES.CONSTANTS) {
        constantsMissing = false;
        index = extensions.values.indexOf(val);
      }
    }

    if (options.create && constantsMissing) {
      extensions.values.push(this.createElement(CREMATYPES.CONSTANTS));
      index = extensions.values.length - 1;
    }

    return extensions.values[index] as ICremaConstantCollection;
  }

  /**
   * Create business object using moddle service
   */
  private createElement($type: string, props?: any): any {
    return this.moddleService.createElement($type, props);
  }
}

angular.module("cremaPDE.annotations")
  .service("constantAnnotationsService", ConstantAnnotationsService);
