import * as angular from "angular";

import { IFactoryService } from "_core";


// register moddle modules
registerModdleModules.$inject = ["factoryService"];
function registerModdleModules(factoryService: IFactoryService): void {

  factoryService.registerModdleExtension("camunda", require("./camunda.json"));
  factoryService.registerModdleExtension("crema", require("./crema.json"));

}


angular
  .module("cremaPDE.processModeler")
  .run(registerModdleModules)
  ;
