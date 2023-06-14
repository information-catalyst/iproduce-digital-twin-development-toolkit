import * as angular from "angular";

const inherits = require("inherits");
const BpmnRenderer = require("bpmn-js/lib/draw/BpmnRenderer");

import { IFactoryService } from "_core";
import { IBpmnTypesService } from "process-modeler";
import { IColorManagerService, IColorPreset } from "../";



registerColorRendererModule.$inject = [
  "factoryService",
  "bpmnTypesService",
  "colorManagerService"
];

function registerColorRendererModule(
  factoryService: IFactoryService,
  bpmnTypesService: IBpmnTypesService,
  colorManagerService: IColorManagerService,
): void {

  function ColorRenderer(eventBus, styles, pathMap, canvas) {

    BpmnRenderer.call(this, eventBus, styles, pathMap, canvas, 1200);


    const originalDrawShape = this.drawShape;
    this.drawShape = function(visuals, element) {

      const colorPreset = colorManagerService.getColorPreset();
      const result = originalDrawShape.call(this, visuals, element);

      // if model does not set color
      if (!bpmnTypesService.hasColor(element)) {

        if (bpmnTypesService.isGateway(element)) {
          result.style.fill = colorPreset.gatewayColor;
        } else if (bpmnTypesService.isEvent(element)) {
          result.style.fill = colorPreset.eventColor;
        } else if (bpmnTypesService.isActivity(element)) {

          if (!bpmnTypesService.isSubProcessExpanded(element)) {
            result.style.fill = colorPreset.activityColor;
          }

        }

      }


      return result;
    };

  }

  inherits(ColorRenderer, BpmnRenderer);
  ColorRenderer.$inject = [ "eventBus", "styles", "pathMap", "canvas" ];


  factoryService.registerModule({
    __init__: [ "colorRenderer" ],
    colorRenderer: [ "type", ColorRenderer ]
  });


}


angular
  .module("cremaPDE.extensions")
  .run(registerColorRendererModule)
  ;

