import * as angular from "angular";

import { IFactoryService } from "_core";

// register module
registerGlobalDeleteModule.$inject = ["factoryService"];
function registerGlobalDeleteModule(factoryService: IFactoryService): void {

  factoryService.registerModule(require("./global-delete.ts"));

}


angular
  .module("cremaPDE.extensions")
  .run(registerGlobalDeleteModule)
  ;
