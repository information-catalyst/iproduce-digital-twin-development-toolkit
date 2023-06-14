import * as angular from "angular";

import { IFactoryService } from "_core";

// register palette module
registerPaletteModule.$inject = ["factoryService"];
function registerPaletteModule(factoryService: IFactoryService): void {

  factoryService.registerModule({
    palette: [ "value", null ],
    paletteProvider: [ "value", null ],
  });

}


angular
  .module("cremaPDE.palette")
  .run(registerPaletteModule)
  ;
