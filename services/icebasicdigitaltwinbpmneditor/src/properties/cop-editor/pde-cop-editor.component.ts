import * as angular from "angular";

import { IProcessModeler} from "_core";
import { IProcessAnnotationsService, ICremaFormulation } from "annotations";


class CopEditorController {

  static $inject = [
    "processAnnotationsService"
  ];

  // current selected element in diagram
  public selectedElement: BpmnJS.IRegistryElement;

  public propertyChanged: ({ $event: { propertyName: string, propertyValue: any }}) => void;
  public propertyValue: any;


  constructor(
    private annotationsService: IProcessAnnotationsService,
  ) {
  }


  /*
  * Read property value from annotations service
  */
  private readProperty(): void {

    const formulation: ICremaFormulation = this.annotationsService.getOptimizationFormulation({
      element: this.selectedElement.businessObject,
    });

    this.propertyValue = (formulation && formulation.value) || "";
  }


  /**
   * Update bpmn diagram value and raise property changed
   */
  public writeProperty($event: any): void {

    this.propertyValue = $event.newValue;

    this.annotationsService.setOptimizationFormulation({
      element: this.selectedElement.businessObject,
      formulation: this.propertyValue
    });

    // raise property changed event
    this.propertyChanged({ $event: {
      propertyName: "extensionElements",
      propertyValue: this.selectedElement.businessObject.extensionElements
    }});

  }


  /**
   * When selected element changes
   */
  public $onChanges(changes: any): void {

    if (changes.selectedElement) {
      this.readProperty();
    }

  }


}



class CopEditorComponent implements ng.IDirective {

  bindings = {
    propertyChanged: "&",
    readOnly: "<",
    selectedElement: "<",
  };

  controller = CopEditorController;
  template = require("./pde-cop-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeCopEditor", new CopEditorComponent())
  ;
