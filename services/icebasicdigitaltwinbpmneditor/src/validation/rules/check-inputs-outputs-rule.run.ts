import * as angular from "angular";

import { IIopeAnnotationsService } from "annotations";
import { IBpmnTypesService, IBpmnGatewayService } from "process-modeler";
import { IValidationRulesService } from "../";


addCheckInputsOutputsRule.$inject = [
  "$translate",
  "validationRulesService",
  "iopeAnnotationsService"
];
function addCheckInputsOutputsRule(
  $translate: angular.translate.ITranslateService,
  rulesService: IValidationRulesService,
  iopeService: IIopeAnnotationsService
  ): void {

  // add rule for checking incoming connections
  rulesService.addValidationRule({
    canCheck: (element: BpmnJS.IRegistryElement) => iopeService.canHaveAnnotations(element),
    errorMessage : "Not all conditions set",
    isValid: (element: BpmnJS.IRegistryElement) => iopeService.hasAllInputsOutputsConnected(element),
  });

}


angular
.module("cremaPDE.validation")
.run(addCheckInputsOutputsRule);