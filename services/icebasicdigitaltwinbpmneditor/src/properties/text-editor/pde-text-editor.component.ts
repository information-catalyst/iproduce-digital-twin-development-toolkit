
class TextEditorController {

  public selectedElement: BpmnJS.IRegistryElement;
  public propertyName: string;
  public propertyValue: string;
  public propertyChanged: ({ $event: { propertyName: string, propertyValue: any }}) => void;
  public readOnly: boolean;

  public $onChanges(changes: any): void {
    if (changes.selectedElement) {
      this.readProperty();
    }
  }


  private readProperty(): void {

    if (this.selectedElement && this.selectedElement.businessObject && this.propertyName) {
      const value: any = this.selectedElement.businessObject.get(this.propertyName);
      this.propertyValue = value && value.toString() || "";
    }

  }


  public textChanged(): void {
    this.propertyChanged({ $event: { propertyName: this.propertyName, propertyValue: this.propertyValue }});
  }

}



class TextEditorComponent implements ng.IDirective {

  bindings = {
    propertyLabel: "@",
    propertyName: "@",
    propertyChanged: "&",
    readOnly: "<",
    selectedElement: "<",
  };

  controller = TextEditorController;
  template = require("./pde-text-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeTextEditor", new TextEditorComponent())
  ;
