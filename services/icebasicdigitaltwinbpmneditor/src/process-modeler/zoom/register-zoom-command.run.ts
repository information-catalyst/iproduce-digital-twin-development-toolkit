import * as angular from "angular";

import { IProcessModeler} from "_core";
import { IToolbarService } from "toolbar";
import { ICanvasService } from "../";


registerZoomCommand.$inject = [
  "$translate",
  "canvasService",
  "toolbarService"
];
function registerZoomCommand(
  $translate: angular.translate.ITranslateService,
  canvasService: ICanvasService,
  toolbarService: IToolbarService,
): void {

  toolbarService.addButtonGroup({

    isVisible: () => canvasService.areOperationsAllowed(),

    key: "zoom",

    buttons: [
      {
        getIcon: () => "fa-minus",
        clickAction: () => canvasService.decreaseZoom()
      },
      {
        getText: () => {
          const zoom: number = canvasService.getZoom();
          return parseInt(zoom.toString(), 0) + "%";
        },
        children: [
          {
            getText: () => $translate.instant("TOOLBAR.FitToWindow"),
            clickAction: () => canvasService.setZoom("fit"),
          }
          ,
          {
            getText: () => "100%",
            clickAction: () => canvasService.setZoom(1),
          }
          ,
          {
            getText: () => "200%",
            clickAction: () => canvasService.setZoom(1.5),
          }
        ]
      },
      {
        getIcon: () => "fa-plus",
        clickAction: () => canvasService.increaseZoom()
      }
    ]
  });

}


angular
.module("cremaPDE.processModeler")
.run(registerZoomCommand)
;
