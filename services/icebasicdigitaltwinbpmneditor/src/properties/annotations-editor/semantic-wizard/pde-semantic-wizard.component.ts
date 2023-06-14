import * as angular from "angular";

import { IDhsService, IGetLinkedConceptsRequest, ISemanticConceptDTO } from "dhs";


export interface ISemanticWizardResult {
  concept: ISemanticConceptDTO;
  varName: string;
}


class SemanticWizardController {

  static $inject = ["dhsService"];

  public close: (value: any) => void;
  public dismiss: () => void;

  public section: string;
  public request: IGetLinkedConceptsRequest;

  public concepts: ISemanticConceptDTO[];
  public selectedConcept: ISemanticConceptDTO;
  public varName: string;

  public searching: boolean;


  constructor(
    private dhsService: IDhsService,
  ) {
    this.section = "search";
  }

  // user does a search
  public search(): void {

    this.section = "searching";

    this
      .dhsService
      .getLinkedConcepts(this.request)
      .then((concepts) => {

        this.concepts = concepts;
        this.selectedConcept = null;
        this.section = "results";

      })
      .catch((err) => {
        this.section = "search";
        throw new Error("Unable to retrieve linked concepts from DHS");
      });
  }

  // user wants to do another search
  public changeCriteria(): void {
    this.selectedConcept = null;
    this.concepts = null;
    this.section = "search";
  }

  // user selects a concept from the list (or from the ontology graph)
  public selectConcept(concept: ISemanticConceptDTO): void {
    this.selectedConcept = concept;
  }

  // input is valid when user has selected concept and input a variable name
  public canAccept(): boolean {
    return this.selectedConcept && this.varName ? true : false;
  }

  // user clicks on accept and the dialog closes, we return the selected concept
  public accept(): void {

    if (!this.selectedConcept) {
      return;
    }

    this.close({$value: <ISemanticWizardResult>{
      concept: this.selectedConcept,
      varName: this.varName
    }});

  }

}



class SemanticWizardComponent implements ng.IDirective {

  bindings = {
    close: "&",
    dismiss: "&"
  };

  controller = SemanticWizardController;
  template = require("./pde-semantic-wizard.component.pug");

}

angular.module("cremaPDE.properties")
  .component("pdeSemanticWizard", new SemanticWizardComponent());

