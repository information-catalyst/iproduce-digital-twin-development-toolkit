import * as angular from "angular";

import { IBpmnTypesService, IBpmnGatewayService } from "process-modeler";
import { IValidationRulesService } from "../";


addCheckConditionsRule.$inject = [
  "$translate",
  "validationRulesService",
  "bpmnTypesService",
  "bpmnGatewayService"
];
function addCheckConditionsRule(
  $translate: angular.translate.ITranslateService,
  rulesService: IValidationRulesService,
  typesService: IBpmnTypesService,
  gatewayService: IBpmnGatewayService
  ): void {

  // add rule for checking incoming connections
  rulesService.addValidationRule({
    canCheck: (element: BpmnJS.IRegistryElement) => typesService.isGateway(element),
    errorMessage : "Not all conditions set",
    isValid: (element: BpmnJS.IRegistryElement) => gatewayService.hasAllConditionsSet(element),
  });

}


angular
.module("cremaPDE.validation")
.run(addCheckConditionsRule);