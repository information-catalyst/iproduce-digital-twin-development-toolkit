import * as angular from "angular";

import { IProcessModeler} from "_core";
import { IPropertiesService } from "../";

class GatewayEditorController {

  public selectedElement: BpmnJS.IRegistryElement;
  public readOnly: boolean;

  public getConditions(): any[] {
    return this.selectedElement && this.selectedElement.outgoing || [];
  }

  public isDefault(condition: BpmnJS.IModdleElement): boolean {

    if (!this.selectedElement) {
      return false;
    }

    const el: any = (<any>this.selectedElement.businessObject).default;
    return el && el.id === condition.id || false;
  }


}


class GatewayEditorComponent implements ng.IDirective {

  bindings = {
    propertyChanged: "&",
    readOnly: "<",
    selectedElement: "<",
  };

  controller = GatewayEditorController;
  template = require("./pde-gateway-editor.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeGatewayEditor", new GatewayEditorComponent())
  ;
