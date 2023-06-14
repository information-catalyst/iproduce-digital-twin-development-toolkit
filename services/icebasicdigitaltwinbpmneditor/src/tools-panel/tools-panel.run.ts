import * as angular from "angular";

import { IProcessModeler, IManagerService } from "_core";
import { IToolsPanelService, IToolPanel } from "tools-panel";

toolsPanelRun.$inject = ["managerService", "toolsPanelService"];

function toolsPanelRun(managerService: IManagerService, toolsPanelService: IToolsPanelService) {

  managerService.onNew(() => {
    toolsPanelService.activateTool("properties");
  });

  managerService.onOpened(() => {
    toolsPanelService.activateTool("properties");
  });
}

angular
  .module("cremaPDE")
  .run(toolsPanelRun);