import * as angular from "angular";

import { IBpmnTypesService } from "process-modeler";
import { IValidationRulesService } from "../";


addCheckConnectionsRule.$inject = [
  "$translate",
  "validationRulesService",
  "bpmnTypesService"
];
function addCheckConnectionsRule(
  $translate: angular.translate.ITranslateService,
  rulesService: IValidationRulesService,
  typesService: IBpmnTypesService,
  ): void {

  // add rule for checking incoming connections
  rulesService.addValidationRule({
    canCheck: (element: BpmnJS.IRegistryElement) => typesService.canHaveIncoming(element),
    errorMessage : "Missing incoming connection",
    isValid: (element: BpmnJS.IRegistryElement) => typesService.hasIncoming(element),
  });

  // add rule for checking outgoing connections
  rulesService.addValidationRule({
    canCheck: (element: BpmnJS.IRegistryElement) => typesService.canHaveOutgoing(element),
    errorMessage : "Missing outgoing connection",
    isValid: (element: BpmnJS.IRegistryElement) => typesService.hasOutgoing(element),
  });

}


angular
.module("cremaPDE.validation")
.run(addCheckConnectionsRule);