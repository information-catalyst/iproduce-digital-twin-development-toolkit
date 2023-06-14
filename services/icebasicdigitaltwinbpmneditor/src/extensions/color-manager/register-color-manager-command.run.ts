import * as angular from "angular";
import { IToolbarService } from "toolbar";
import { IColorManagerService } from "./";

registerColorManagerCommand.$inject = ["toolbarService", "colorManagerService"];
function registerColorManagerCommand(toolbarService: IToolbarService, colorManagerService: IColorManagerService) {

  toolbarService.addButtonGroup({
    alignRight: true,
    key: "color-manager",
    buttons: [{
      getIcon: () => "fa-paint-brush",
      clickAction: () => colorManagerService.openPresetManager(),
    }]
  });


}


angular
.module("cremaPDE.extensions")
.run(registerColorManagerCommand);
