import * as angular from "angular";

import { IFactoryService } from "_core";

// register moddle modules
registerClipboardModule.$inject = ["factoryService"];
function registerClipboardModule(factoryService: IFactoryService): void {

  factoryService.registerModule(require("./clipboard.module.ts"));

}


angular
  .module("cremaPDE.processModeler")
  .run(registerClipboardModule)
  ;
