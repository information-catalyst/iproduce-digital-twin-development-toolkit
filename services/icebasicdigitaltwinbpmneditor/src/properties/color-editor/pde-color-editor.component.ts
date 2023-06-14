class ColorEditorController {

  public selectedElement: BpmnJS.IRegistryElement;
  public propertyName: string;
  public selectedColor: string;
  public propertyChanged: ({ $event: { propertyName: string, propertyValue: any }}) => void;
  public readOnly: boolean;


  private readProperty(): void {
    this.selectedColor = this.selectedElement.businessObject.di[this.propertyName];
  }


  /**
   * When selected element changes
   */
  public $onChanges(changes: any): void {
    if (changes.selectedElement) {
      this.readProperty();
    }
  }



  public colorChanged(prop: string): void {
    this.propertyChanged({ $event: { propertyName: this.propertyName, propertyValue: this.selectedColor }});
  }

}



class ColorEditorComponent implements ng.IDirective {

  bindings = {
    propertyLabel: "@",
    propertyName: "@",
    propertyChanged: "&",
    readOnly: "<",
    selectedElement: "<",
  };

  controller = ColorEditorController;
  template = require("./pde-color-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeColorEditor", new ColorEditorComponent())
  ;
