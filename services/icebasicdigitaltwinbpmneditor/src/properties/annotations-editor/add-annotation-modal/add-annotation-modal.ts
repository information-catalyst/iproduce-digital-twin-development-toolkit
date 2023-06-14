import * as angular from "angular";

import { IMarketplaceService } from "../../../marketplace";
interface IResolve {
  title: string;
}

export interface IAnnotation {
  concept?: string;
  url?: string;
  value: string;
}

export class AddAnnotationModalController {
  static $inject = ["marketplaceService"];

  constructor(
    public marketplaceService: IMarketplaceService
  ) {
    //
  }
  // variables
  public addAnnotationForm: ng.IFormController;
  public newAnnotations: IAnnotation[];
  public rawInput: string;
  public pddlInput: string;
  public activeTab: number;
  public previousTab: number;
  // inputs
  public resolve: IResolve;
  public close;
  public dismiss;
  public modalInstance: ng.ui.bootstrap.IModalServiceInstance;


  public $onInit(): void {
    this.newAnnotations = [];
    this.rawInput = "";
    this.initRawInput();
  }

  public initRawInput(): void {
    if (this.previousTab !== 0) {
      this.previousTab = 0;
      this.newAnnotations = [];
      this.rawInput = "";
    }
  }

  public initComfortInput(): void {
    if (this.previousTab !== 1) {
      this.previousTab = 1;
      this.newAnnotations = [];
      this.newAnnotations.push({
        url: "",
        concept: "",
        value: ""
      });
    }
  }

  public initPddlInput(): void {
    if (this.previousTab !== 2) {
      this.previousTab = 2;
      this.newAnnotations = [];
      this.pddlInput = "";
    }
  }

  public formValid(): boolean {
    // raw input
    if (this.activeTab === 0 || this.activeTab === 2) {
      return this.newAnnotations.length > 0;
    } else { // comfort input
      return this.addAnnotationForm.$valid;
    }
  }

  public removeAnnotation(annotation: IAnnotation): void {
    this.newAnnotations.splice(this.newAnnotations.indexOf(annotation), 1);
  }

  public addAnnotation(): void {
    this.newAnnotations.push({
      url: "",
      concept: "",
      value: ""
    });
  }

  public parseRawInput(input: string): void {
    this.newAnnotations = [];
    const splittedInput: string[] = this.rawInput.split("\n");
    for (const input of splittedInput) {
      if (input.charAt(0) === "(" && input.charAt(input.length - 1) === ")") {
        this.newAnnotations.push({
          value: input
        });
      }
    }
  }

  public parsePddlInput(input: string): void {
    this.newAnnotations = [];
    const parsedAnnotations: string[] = this.marketplaceService.generateParsedPreconditionsEffects(input);
    for (const annotation of parsedAnnotations) {
      this.newAnnotations.push({
        value: annotation
      });
    }
  }

  public getResult(): string {
    let result = "";
    // if raw input
    if (this.activeTab === 0 || this.activeTab === 2) {
      // this.parseRawInput(this.rawInput);
      if (this.newAnnotations.length === 1) {
        return `<crema:element>${this.newAnnotations[0].value}</crema:element>`;
      } else if (this.newAnnotations.length > 1) {
        result += `<crema:expr type="and">`;
        for (const annotation of this.newAnnotations) {
          result +=
            `
                  <crema:element>${annotation.value}</crema:element>`;
        }
        result += `
  </crema:expr>`;
        return result;
      } else {
        return "Waiting for valid input";
      }

    } else {
      // comfort input
      if (this.newAnnotations.length === 1) {
        return `<crema:element>(${this.newAnnotations[0].url} ${this.newAnnotations[0].concept})</crema:element>`;
      } else {
        result += `<crema:expr type="and">`;
        for (const annotation of this.newAnnotations) {
          result +=
            `
                  <crema:element>(${annotation.url} ${annotation.concept})</crema:element>`;
        }
        result += `
  </crema:expr>`;
        return result;
      }
    }

  }

  public submitAnnotations(): void {
    // generating value property for comfort input
    if (this.activeTab === 1) {
      for (const annotation of this.newAnnotations) {
        annotation.value = `(${annotation.url} ${annotation.concept})`;
      }
    }

    this.modalInstance.close(this.newAnnotations);
  }
}


class AddAnnotationModalComponent implements ng.IDirective {

  bindings = {
    close: "&",
    dismiss: "&",
    modalInstance: "<",
    resolve: "<"
  };

  controller = AddAnnotationModalController;
  template = require("./add-annotation-modal.pug");
}

angular.module("cremaPDE.properties")
  .component("addAnnotationModal", new AddAnnotationModalComponent());
