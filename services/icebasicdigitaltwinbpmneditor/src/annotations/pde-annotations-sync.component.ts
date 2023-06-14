import * as angular from "angular";

import { IProcessModeler } from "_core";
import { ICommandStackService } from "process-modeler";
import { IServiceAnnotationsService } from "./";


class AnnotationsSyncController {

  static $inject = [
    "commandStackService",
    "serviceAnnotationsService"
  ];

  constructor(
    private _commandStackService: ICommandStackService,
    private _annotationsService: IServiceAnnotationsService
  ) {

    // hook when creating/deleting elements for undo/redo
    this._commandStackService.onShapeCreate(this.onShapeCreate.bind(this));
    this._commandStackService.onShapeCreateRevert(this.onShapeCreateRevert.bind(this));
    this._commandStackService.onElementsDelete(this.onElementsDelete.bind(this));
    this._commandStackService.onElementsDeleteRevert(this.onElementsDeletedRevert.bind(this));

  }

  /**
   * When new shape is created, if context contains implementations, restore them (it will be a redo operation)
   *
   * @param  {any} evt BPMN Event data
   */
  private onShapeCreate(evt: BpmnJS.ICommandStackEvent): void {
    if ((<any>evt.context).implementations) {
      (<any>evt.context).implementations.forEach((impl) => this._annotationsService.addServiceImplementation([impl]));
    }
  }

  /**
   * On elements create revert, remove any references that exist at process level and save them for redo
   *
   * @param  {any} evt BPMN Event data
   */
  private onShapeCreateRevert(evt: BpmnJS.ICommandStackEvent): void {

    const el: BpmnJS.IRegistryElement = evt.context.shape;
    if (el && el.type === "bpmn:ServiceTask") {
      (<any>evt.context).implementations = this._annotationsService.removeServiceImplementationByImplementsId(el.id);
    }
  }

  /**
   * On elements deleted, remove any references that exist at process level
   *
   * @param  {any} evt BPMN Event data
   */
  private onElementsDelete(evt: BpmnJS.ICommandStackEvent): void {

    if (evt.context.elements) {
      evt.context.elements.forEach((el: BpmnJS.IRegistryElement) => {

        if (el.type === "bpmn:ServiceTask") {

          const impls: any = this._annotationsService.removeServiceImplementationByImplementsId(el.id);
          if (impls) {
            impls.forEach((impl) => evt.context.elements.push(impl));
          }
        }

      });
    }

  }

  /**
   * On elements deleted redo operation, restore references at process level
   *
   * @param  {any} evt BPMN Event data
   */
  private onElementsDeletedRevert(evt: BpmnJS.ICommandStackEvent): void {

    if (evt.context.elements) {
      evt.context.elements.forEach((el: any) => {

        if (this._annotationsService.isServiceImplementation(el)) {
          this._annotationsService.addServiceImplementation([el]);
        }

      });
    }

  }

}

class AnnotationsSyncComponent implements ng.IDirective {
  controller = AnnotationsSyncController;
}

angular.module("cremaPDE.annotations")
  .component("pdeAnnotationsSync", new AnnotationsSyncComponent());
