
class TextAreaEditorController {

  // current selected element in diagram
  public selectedElement: BpmnJS.IRegistryElement;
  public propertyValue: string;
  public propertyName: string;
  public propertyChanged: ({ $event: { propertyName: string, propertyValue: any }}) => void;
  public readOnly: boolean;


  private readProperty(): void {

    if (this.selectedElement && this.selectedElement.businessObject && this.propertyName) {
      const value: any = this.selectedElement.businessObject.get(this.propertyName);
      this.propertyValue = value && value.toString() || "";
    }

  }


  public $onChanges(changes: any): void {
    if (changes.selectedElement) {
      this.readProperty();
    }
  }


  public textChanged(): void {
    this.propertyChanged({ $event: { propertyName: this.propertyName, propertyValue: this.propertyValue }});
  }

}



class TextAreaEditorComponent implements ng.IDirective {

  bindings = {
    propertyLabel: "@",
    propertyName: "@",
    propertyChanged: "&",
    readOnly: "<",
    selectedElement: "<",
  };

  controller = TextAreaEditorController;
  template = require("./pde-textarea-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeTextAreaEditor", new TextAreaEditorComponent())
  ;
