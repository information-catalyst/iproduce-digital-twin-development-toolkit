import * as angular from "angular";

import { IToolbarService } from "toolbar";
import { IFullScreenService } from "_common";


registerFullScreenCommand.$inject = [
  "toolbarService",
  "fullScreenService"
];

function registerFullScreenCommand(
  toolbarService: IToolbarService,
  fullScreenService: IFullScreenService,
) {

  toolbarService.addButtonGroup({
    key: "full-screen",
    buttons: [{

      getIcon: () => "fa-desktop",
      isActive: () => fullScreenService.isEnabled(),
      clickAction: () => fullScreenService.toggle(),
    }]
  });

}


// init component
angular
.module("cremaPDE.processManager")
.run(registerFullScreenCommand)
  ;
