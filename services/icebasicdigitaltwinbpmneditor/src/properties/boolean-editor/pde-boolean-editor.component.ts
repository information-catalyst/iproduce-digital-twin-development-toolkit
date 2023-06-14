class BooleanEditorController {


  // current selected element in diagram
  public selectedElement: BpmnJS.IRegistryElement;
  public propertyValue: boolean;
  public propertyName: string;
  public propertyChanged: ({ $event: { propertyName: string, propertyValue: any }}) => void;
  public readOnly: boolean;

  private readProperty(): void {

    if (this.selectedElement && this.selectedElement.businessObject && this.propertyName) {
      this.propertyValue = this.selectedElement.businessObject.get<boolean>(this.propertyName) || false;
    }

  }


  /**
   * When selected element changes
   */
  public $onChanges(changes: any): void {
    if (changes.selectedElement) {
      this.readProperty();
    }
  }


  public valueChanged(): void {
    this.propertyChanged({ $event: { propertyName: this.propertyName, propertyValue: this.propertyValue }});
  }

}



class BooleanEditorComponent implements ng.IDirective {

  bindings = {
    propertyLabel: "@",
    propertyName: "@",
    selectedElement: "<",
    propertyChanged: "&",
    readOnly: "<"
  };

  controller = BooleanEditorController;
  template = require("./pde-boolean-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeBooleanEditor", new BooleanEditorComponent())
  ;
