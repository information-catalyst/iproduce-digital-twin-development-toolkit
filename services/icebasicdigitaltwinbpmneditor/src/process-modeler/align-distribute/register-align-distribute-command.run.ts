import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";
import { IToolbarService } from "toolbar";
import { IAlignDistributeService } from "./align-distribute.service";


registerAlignDistributeCommand.$inject = [
  "managerService",
  "toolbarService",
  "alignDistributeService",
];
function registerAlignDistributeCommand(
  managerService: IManagerService,
  toolbarService: IToolbarService,
  service: IAlignDistributeService,
) {

  toolbarService.addButtonGroup({

    isVisible: () => managerService.getModeler() != null,

    key: "align-distribute",

    buttons: [
    {
      isDisabled: () => !service.canDistributeElements() && !service.canAlignElements(),
      getIcon: () => "fa-align-center",
      clickAction: () => service.openAlignDistributePopup(),

    }]
  });

}



// init component
angular
.module("cremaPDE.processModeler")
.run(registerAlignDistributeCommand)
;
