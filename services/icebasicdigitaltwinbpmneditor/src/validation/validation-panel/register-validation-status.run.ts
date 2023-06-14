import * as angular from "angular";

import { IStatusPanelService } from "status-panel";
import { IProcessValidationService } from "../";

registerValidationStatusPanel.$inject = [
  "statusPanelService",
  "processValidationService"
];
function registerValidationStatusPanel(
  statusPanelService: IStatusPanelService,
  validationService: IProcessValidationService
) {

  statusPanelService.addButton({
    getCss: () => validationService.hasErrors() ? "btn-danger" : "btn-success",
    getText: () => `Validation errors : ${validationService.getValidationErrors().length}`,
    clickAction: () => statusPanelService.toggleActivePanel("pde-validation-panel"),
    isDisabled: () => !validationService.hasErrors(),
    isVisible: () => validationService.canValidate(),
  });

  statusPanelService.addPanel("<pde-validation-panel />");

}


angular
.module("cremaPDE.validation")
.run(registerValidationStatusPanel);
