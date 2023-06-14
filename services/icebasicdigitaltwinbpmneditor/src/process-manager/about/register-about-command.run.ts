import * as angular from "angular";

import { IToolbarService } from "toolbar";
import { IAppConstants } from "_common";


registerAboutCommand.$inject = [
  "$uibModal",
  "toolbarService",
  "CONSTANTS",
];

function registerAboutCommand(
  $uibModal: ng.ui.bootstrap.IModalService,
  toolbarService: IToolbarService,
  CONSTANTS: IAppConstants,
) {

  const img = require("./crema_logo_transparent.png");

  /**
   * Open about dialog
   */
  function openAboutModal(): void {
    $uibModal.open({
      resolve: {
        imageSrc: () => img,
      },
      component: "pdeAboutPopup",
    }).result.catch(angular.noop);
  }

  toolbarService.addButtonGroup({
    alignRight: true,
    key: "about",
    buttons: [
    {
        getText: () => CONSTANTS.VERSION,
        getImage: () => img,
        clickAction: openAboutModal,
    }]
  });

}


// init component
angular
.module("cremaPDE.processManager")
.run(registerAboutCommand)
;
