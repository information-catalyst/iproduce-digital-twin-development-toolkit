import * as angular from "angular";
import { IBpmnTypesService } from "process-modeler";


class BoundsEditorController {

  static $inject = [
    "bpmnTypesService"
  ];

  public selectedElement: BpmnJS.IRegistryElement;
  public propertyValue: BpmnJS.IBounds;
  public propertyChanged: ({ $event: { propertyName: string, propertyValue: any }}) => void;
  public readOnly: boolean;


  constructor(
    private _bpmnTypesService: IBpmnTypesService
  ) {}

  /**
   * When selected element changes
   */
  public $onChanges(changes: any): void {
    if (changes.selectedElement) {
      this.readProperty();
    }
  }


  private readProperty(): void {

    if (this.selectedElement) {
      this.propertyValue = {
        x: this.selectedElement.x,
        y: this.selectedElement.y,
        width: this.selectedElement.width,
        height: this.selectedElement.height
      };
    }

  }


  public valueChanged(prop: string): void {
    this.propertyChanged({ $event: { propertyName: prop, propertyValue: this.propertyValue[prop] }});
  }


  public canMove(): boolean {
    if (!this.selectedElement) {
      return false;
    }

    return !this._bpmnTypesService.isProcess(this.selectedElement) && !this._bpmnTypesService.isSequenceFlow(this.selectedElement);
  }

  public canResize(): boolean {

    if (!this.selectedElement) {
      return false;
    }

    return this._bpmnTypesService.isSubProcessExpanded(this.selectedElement);
  }

}



class BoundsEditorComponent implements ng.IDirective {

  bindings = {
    propertyChanged: "&",
    readOnly: "<",
    selectedElement: "<",
  };

  controller = BoundsEditorController;
  template = require("./pde-bounds-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeBoundsEditor", new BoundsEditorComponent())
  ;
