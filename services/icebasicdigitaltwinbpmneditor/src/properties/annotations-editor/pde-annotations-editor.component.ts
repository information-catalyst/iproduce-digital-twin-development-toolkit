import * as angular from "angular";

import { IProcessModeler } from "_core";

import {
  IIopeAnnotationsService,
  ICremaInputExpression,
  ICremaOutputExpression,
  ICreatePreconditionExpression,
  ICreateEffectExpression,
  ICremaPreconditionCollection,
  ICremaEffectCollection,
  ICremaElement,
  IServiceAnnotationsService,
  ICremaConstantCollection
} from "annotations";

import { ISemanticWizardResult } from "./semantic-wizard";
import { IAnnotation } from "./add-annotation-modal";
import { ISpcService } from "_common";
import { IConstantAnnotationsService } from "annotations/constant-annotation.service";


class AnnotationsPropertyEditorController {

  static $inject = [
    "$uibModal",
    "$timeout",
    "iopeAnnotationsService",
    "serviceAnnotationsService",
    "spcService",
    "constantAnnotationsService"
  ];

  // current selected tab group
  private selectedGroup: string;

  private inputs: ICremaInputExpression[];
  private selectedInput: ICremaInputExpression;

  private outputs: ICremaOutputExpression[];
  private selectedOutput: ICremaOutputExpression;

  private preconditions: ICremaPreconditionCollection;
  private selectedPrecondition: ICremaElement;

  private effects: ICremaEffectCollection;
  private selectedEffect: ICremaElement;

  private constants: ICremaConstantCollection;

  // current selected element in diagram
  public selectedElement: BpmnJS.IRegistryElement;
  public propertyChanged: ({ $event: { propertyName: string, propertyValue: any } }) => void;
  public readOnly: boolean;


  constructor(
    private $uibModal: angular.ui.bootstrap.IModalService,
    private $timeout: ng.ITimeoutService,
    private _annotationsService: IIopeAnnotationsService,
    private _serviceAnnotationsService: IServiceAnnotationsService,
    private spcService: ISpcService,
    private constantAnnotationsService: IConstantAnnotationsService
  ) {
    this.selectedGroup = "inputs";
  }

  public $onChanges(changes: any): void {
    if (changes.selectedElement) {
      this.readAnnotations();
    }
  }

  private readAnnotations(): void {

    this.inputs = this.selectedElement != null ?
      this._annotationsService.getInputAnnotations({ element: this.selectedElement.businessObject }) || [] : [];

    this.selectedInput = this.inputs.length ? this.inputs[0] : null;

    this.outputs = this.selectedElement != null ?
      this._annotationsService.getOutputAnnotations({ element: this.selectedElement.businessObject }) || [] : [];

    this.selectedOutput = this.outputs.length ? this.outputs[0] : null;

    this.preconditions = this._annotationsService.getPreconditionAnnotations({ element: this.selectedElement.businessObject });
    this.selectedPrecondition = this.getPreconditions().length ? this.getPreconditions()[0] : null;

    this.effects = this._annotationsService.getEffectAnnotations({ element: this.selectedElement.businessObject });
    this.selectedEffect = this.getEffects().length ? this.getEffects()[0] : null;

    this.constants = this.constantAnnotationsService.getServiceConstants({ element: this.selectedElement.businessObject });
  }

  public isSelectedGroup(group: string): boolean {
    return this.selectedGroup === group;
  }


  public selectGroup(group: string): void {
    this.selectedGroup = group;
  }

  private openSemanticWizard(): ng.IPromise<ISemanticWizardResult> {

    return this.$uibModal.open({
      component: "pdeSemanticWizard",
      size: "lg"
    }).result;

  }

  private raisePropertyChanged(): void {
    this.propertyChanged({ $event: { propertyName: "extensionElements", propertyValue: this.selectedElement.businessObject.extensionElements } });
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * CONSTANTS * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  addConstantModal(input: ICremaInputExpression) {
    this.$uibModal.open({
      component: "pdeAddConstantModal",
      size: "md"
    }).result
      .then(result => {
        this.addConstant(input, result);
      })
      .catch(angular.noop);
  }

  addConstant(input: ICremaInputExpression, value: string) {
    const newConstant = this.constantAnnotationsService.addConstant({
      element: this.selectedElement.businessObject,
      value: value,
      variable: input.element.name,
      create: true
    });
    this.constants = this.constantAnnotationsService.getServiceConstants({ element: this.selectedElement.businessObject });
    this.raisePropertyChanged();
  }

  editConstant(input: ICremaInputExpression) {
    const currentValue = this.getConstantValue(input);
    this.$uibModal.open({
      component: "pdeAddConstantModal",
      size: "md",
      resolve: {
        editConstant: () => {
          return currentValue;
        }
      }
    }).result
      .then(result => {
        this.removeConstant(input);
        this.addConstant(input, result);
      })
      .catch(angular.noop);
  }
  removeConstant(input: ICremaInputExpression) {
    for (const constant of this.constants.constant) {
      if (constant.element.variable === input.element.name) {
        const index = this.constants.constant.indexOf(constant);
        this.constantAnnotationsService.removeConstantAt(this.selectedElement.businessObject, index);
        this.constants = this.constantAnnotationsService.getServiceConstants({ element: this.selectedElement.businessObject });
        this.raisePropertyChanged();
      }
    }
  }
  getConstantValue(input: ICremaInputExpression): string {
    for (const constant of this.constants.constant) {
      if (constant.element.variable === input.element.name) {
        return constant.element.value;
      }
    }
  }
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * INPUTS  * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  public getTotalInputs(): number {
    return this.inputs && this.inputs.length || 0;
  }

  public hasInputs(): boolean {
    return this.inputs && this.inputs.length ? true : false;
  }

  public isInputSelected(input: ICremaInputExpression): boolean {
    return input ? input === this.selectedInput : this.selectedInput != null;
  }

  public selectInput(input: ICremaInputExpression): void {
    this.selectedInput = input;
  }

  public inputHasConstant(input: ICremaInputExpression): boolean {
    if (this.constants && this.constants.constant && this.constants.constant.length > 0) {
      for (const constant of this.constants.constant) {
        if (constant.element.variable === input.element.name) {
          return true;
        }
      }
    }
    return false;
  }


  // add new input element to annotations
  public addInput(): void {

    this.openSemanticWizard().then((result: ISemanticWizardResult) => {

      this.$timeout(() => {

        const input: ICremaInputExpression = this._annotationsService.addInput({
          element: this.selectedElement.businessObject,
          name: result.varName,
          create: true,
          concept: result.concept.uri
        });

        this.raisePropertyChanged();
        this.inputs = this._annotationsService.getInputAnnotations({ element: this.selectedElement.businessObject }) || [];
        // this.inputs.push(input);
        this.selectedInput = input;

      });

    })
      .catch(() => {
        //
      });

  }


  public removeSelectedInput(): void {
    this._annotationsService.removeInputAt(this.selectedElement.businessObject, this.inputs.indexOf(this.selectedInput));
    this.raisePropertyChanged();
  }


  public clearInputs(): void {
    this._annotationsService.clearInputs(this.selectedElement.businessObject);
    this.raisePropertyChanged();
  }
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * OUTPUTS * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  public getTotalOutputs(): number {
    return this.outputs && this.outputs.length || 0;
  }


  public hasOutputs(): boolean {
    return this.outputs && this.outputs.length ? true : false;
  }

  public isOutputSelected(output: ICremaOutputExpression): boolean {
    return output ? output === this.selectedOutput : this.selectedOutput != null;
  }

  public selectOutput(output: ICremaOutputExpression): void {
    this.selectedOutput = output;
  }


  // add new output element to annotations
  public addOutput(): void {

    this.openSemanticWizard().then((result: ISemanticWizardResult) => {

      this.$timeout(() => {

        const output: ICremaOutputExpression = this._annotationsService.addOutput({
          element: this.selectedElement.businessObject,
          name: result.varName,
          create: true,
          concept: result.concept.uri
        });

        this.raisePropertyChanged();
        this.outputs = this._annotationsService.getOutputAnnotations({ element: this.selectedElement.businessObject }) || [];
        this.selectedOutput = output;

      });

    })
      .catch(() => {
        //
      });

  }


  public removeSelectedOutput(): void {
    this._annotationsService.removeOutputAt(this.selectedElement.businessObject, this.inputs.indexOf(this.selectedOutput));
    this.raisePropertyChanged();
  }


  public clearOutputs(): void {
    this._annotationsService.clearOutputs(this.selectedElement.businessObject);
    this.raisePropertyChanged();
  }
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * PRECONDITIONS * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  public getPreconditions(): ICremaElement[] {
    if (this.preconditions && this.preconditions.expr && this.preconditions.expr.element && this.preconditions.expr.element.length > 0) {
      return this.preconditions.expr.element;
    } else if (this.preconditions && this.preconditions.element && this.preconditions.element.length > 0) {
      return this.preconditions.element;
    } else {
      return [];
    }
    // return this.preconditions && (this.preconditions.expr && this.preconditions.expr.element || this.preconditions.element) || [];
  }

  public getTotalPreconditions(): number {
    return this.preconditions && (this.preconditions.expr && this.preconditions.expr.element || this.preconditions.element).length || 0;
  }

  public hasPreconditions(): boolean {
    const hasCremaExpressions: boolean = this.preconditions && this.preconditions.expr &&
      this.preconditions.expr.element && this.preconditions.expr.element.length ? true : false;
    const hasCremaElements: boolean = this.preconditions && this.preconditions.element && this.preconditions.element.length ? true : false;
    return hasCremaExpressions || hasCremaElements;
  }

  public clearPreconditions(): void {
    this._annotationsService.clearPreconditions(this.selectedElement.businessObject);
    this.selectedPrecondition = null;
    this.raisePropertyChanged();
  }

  public selectPrecondition(precondition: ICremaElement): void {
    this.selectedPrecondition = precondition;
  }

  public isPreconditionSelected(precondition: ICremaElement): boolean {
    return precondition ? this.selectedPrecondition === precondition : this.selectedPrecondition !== null;
  }

  public addPrecondition(): void {
    this.$uibModal.open({
      animation: true,
      component: "addAnnotationModal",
      resolve: {
        title: () => { return "Precondition"; }
      },
      size: "lg"
    }).result.then((newAnnotations: IAnnotation[]) => {
      if (this.getPreconditions() && this.getPreconditions().length) {
        for (const oldAnnotation of this.getPreconditions()) {
          newAnnotations.push({
            value: oldAnnotation.value
          });
        }
      }
      this.clearPreconditions();
      for (const annotation of newAnnotations) {
        const addPreconditionOption: ICreatePreconditionExpression = {
          element: this.selectedElement.businessObject,
          create: true,
          multiple: newAnnotations.length > 1,
          value: annotation.value
        };
        this._annotationsService
          .addPrecondition(addPreconditionOption);
      }

      this.readAnnotations();
    }, angular.noop);
  }

  public removeSelectedPrecondition(): void {
    let index: number = -1;
    const newAnnotations: IAnnotation[] = [];
    index = this.getPreconditions().indexOf(this.selectedPrecondition);
    for (let i = 0; i < this.getPreconditions().length; i++) {
      if (i === index) {
        continue;
      } else {
        newAnnotations.push({
          value: this.getPreconditions()[i].value
        });
      }
    }

    this.clearPreconditions();
    for (const annotation of newAnnotations) {
      const addPreconditionOption: ICreatePreconditionExpression = {
        element: this.selectedElement.businessObject,
        create: true,
        multiple: newAnnotations.length > 1,
        value: annotation.value
      };
      this._annotationsService
        .addPrecondition(addPreconditionOption);
    }

    this.readAnnotations();
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * EFFECTS * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  public getEffects(): ICremaElement[] {
    if (this.effects && this.effects.expr && this.effects.expr.element && this.effects.expr.element.length > 0) {
      return this.effects.expr.element;
    } else if (this.effects && this.effects.element && this.effects.element.length > 0) {
      return this.effects.element;
    } else {
      return [];
    }
    // return this.effects && (this.effects.expr && this.effects.expr.element || this.effects.element) || [];
  }

  public getTotalEffects(): number {
    return this.effects && (this.effects.expr && this.effects.expr.element || this.effects.element).length || 0;
  }

  public hasEffects(): boolean {

    const hasCremaExpressions: boolean = this.effects && this.effects.expr && this.effects.expr.element &&
      this.effects.expr.element.length ? true : false;

    const hasCremaElements: boolean = this.effects && this.effects.element && this.effects.element.length ? true : false;
    return hasCremaExpressions || hasCremaElements;
  }

  public clearEffects(): void {
    this._annotationsService.clearEffects(this.selectedElement.businessObject);
    this.selectedEffect = null;
    this.raisePropertyChanged();
  }

  public selectEffect(effect: ICremaElement): void {
    this.selectedEffect = effect;
  }

  public isEffectSelected(effect: ICremaElement): boolean {
    return effect ? this.selectedEffect === effect : this.selectedEffect !== null;
  }

  public addEffect(): void {
    this.$uibModal.open({
      animation: true,
      component: "addAnnotationModal",
      resolve: {
        title: () => { return "Effect"; }
      },
      size: "lg"
    })
      .result.then((newAnnotations: IAnnotation[]) => {
        if (this.getEffects() && this.getEffects().length) {
          for (const oldAnnotation of this.getEffects()) {
            newAnnotations.push({
              value: oldAnnotation.value
            });
          }
        }
        this.clearEffects();
        for (const annotation of newAnnotations) {

          const addEffectOptions: ICreateEffectExpression = {
            element: this.selectedElement.businessObject,
            create: true,
            multiple: newAnnotations.length > 1,
            value: annotation.value
          };
          this._annotationsService
            .addEffect(addEffectOptions);
        }

        this.readAnnotations();
      }, angular.noop);
  }

  public removeSelectedEffect(): void {

    let index: number = -1;
    const newAnnotations: IAnnotation[] = [];
    index = this.getEffects().indexOf(this.selectedEffect);

    for (let i = 0; i < this.getEffects().length; i++) {
      if (i === index) {
        continue;
      } else {
        newAnnotations.push({
          value: this.getEffects()[i].value
        });
      }
    }

    this.clearEffects();

    for (const annotation of newAnnotations) {
      const addEffectOption: ICreateEffectExpression = {
        element: this.selectedElement.businessObject,
        create: true,
        multiple: newAnnotations.length > 1,
        value: annotation.value
      };
      this._annotationsService
        .addEffect(addEffectOption);
    }

    this.readAnnotations();
  }

  getSvaEditHref(element: BpmnJS.IRegistryElement) {
    const implementation = this._serviceAnnotationsService.getServiceImplementation(this.selectedElement) as any;
    const hasImplementation = implementation && implementation[0];
    const isAbstract = hasImplementation && implementation[0].abstractService && implementation[0].abstractService.marketplaceServiceID;
    const isConcrete = hasImplementation && implementation[0].concreteService && implementation[0].concreteService.marketplaceServiceID;
    let serviceId = "";
    if (isAbstract) {
      serviceId = implementation[0].abstractService.marketplaceServiceID.id;
    } else if (isConcrete) {
      serviceId = implementation[0].concreteService.marketplaceServiceID.id;
    }
    return `https://tuv.crema-project.eu:34009/services/${serviceId}?token=${this.spcService.getToken()}`;
  }


}



class AnnotationsPropertyEditorComponent implements ng.IDirective {

  bindings = {
    propertyChanged: "&",
    selectedElement: "<",
    readOnly: "<"
  };

  controller = AnnotationsPropertyEditorController;
  template = require("./pde-annotations-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeAnnotationsEditor", new AnnotationsPropertyEditorComponent())
  ;
