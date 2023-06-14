import * as angular from "angular";

import { IProcessModeler } from "_core";
import { IToolbarService } from "toolbar";
import { IActionsService } from "../";

registerSearchCommand.$inject = [
  "$translate",
  "toolbarService",
  "actionsService",
];

function registerSearchCommand(
  $translate: angular.translate.ITranslateService,
  toolbarService: IToolbarService,
  actionsService: IActionsService,
): void {

  toolbarService.addButtonGroup({
    key: "search",
    buttons: [
      {
        isVisible: () => actionsService.areOperationsAllowed(),
        getIcon: () => "fa-binoculars",
        getText: () => $translate.instant("TOOLBAR.Search"),
        clickAction: () => actionsService.toggleSearchPad(),
      }]
  });

}


// init component
angular
.module("cremaPDE.processModeler")
.run(registerSearchCommand)
;
