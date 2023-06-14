import * as angular from "angular";

import { IManagerService } from "_core";
import { IStatusPanelService } from "status-panel";

registerViewButtons.$inject = [
  "managerService",
  "statusPanelService"
];
function registerViewButtons (
  managerService: IManagerService,
  statusPanelService: IStatusPanelService
) {

  statusPanelService.addButton({
    getCss: () => managerService.getModeler() && managerService.getModeler().isDesignView() ? "active" : "",
    getText: () => "Design View",
    clickAction: () => managerService.getModeler().setDesignView(),
    isVisible: () => managerService.getModeler() != null,
  });

  statusPanelService.addButton({
    getCss: () => managerService.getModeler() && managerService.getModeler().isXmlView() ? "active" : "",
    getText: () => "Xml View",
    clickAction: () => managerService.getModeler().setXmlView(),
    isVisible: () => managerService.getModeler() != null,
  });

}


angular
.module("cremaPDE.processModeler")
.run(registerViewButtons);
