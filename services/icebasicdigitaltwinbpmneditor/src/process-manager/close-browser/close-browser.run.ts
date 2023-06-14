import * as angular from "angular";

import { IManagerService } from "_core";

askForSaveWhenClosingBrowser.$inject = ["$window", "managerService"];
function askForSaveWhenClosingBrowser($window: ng.IWindowService, managerService: IManagerService ) {

  // only ask for save changes in prod environment, since this collisions with browser reload development
  if (process.env.PROD) {
    $window.onbeforeunload = (event) => {

      if (!managerService.hasAnyChanges()) {
        return;
      }

      const message = "Are you sure you want to leave?";
      if (typeof event === "undefined") {
        event = window.event;
      }
      if (event) {
        event.returnValue = message;
      }
      return message;
    };
  }

}

angular
.module("cremaPDE.processManager")
.run(askForSaveWhenClosingBrowser);

