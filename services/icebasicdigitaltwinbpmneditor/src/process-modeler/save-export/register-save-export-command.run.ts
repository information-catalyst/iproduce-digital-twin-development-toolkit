import * as angular from "angular";

import { IManagerService } from "_core";
import { IToolbarService } from "toolbar";
import { IExportService } from "./export.service";


registerSaveExportCommand.$inject = [
  "$translate",
  "managerService",
  "toolbarService",
  "exportService",
];
function registerSaveExportCommand(
  $translate: angular.translate.ITranslateService,
  managerService: IManagerService,
  toolbarService: IToolbarService,
  exportService: IExportService,
): void {

  toolbarService.addButtonGroup({

    isVisible: () => exportService.canExport() || managerService.getModels().length > 0,
    key: "save-export",

    buttons: [
    {
      getText: () => $translate.instant("TOOLBAR.Save"),
      getIcon: () => "fa-save",
      isVisible: () => managerService.getModels().length > 0 ? true : false,
      isDisabled: () => !managerService.hasChanges(),
      clickAction: () => !managerService.isReadOnly() && managerService.hasChanges() && managerService.saveChanges(),
    },
    {
      getText: () => $translate.instant("TOOLBAR.SaveAs"),
      getIcon: () => "fa-save",
      isVisible: () => managerService.getModels().length > 0 ? true : false,
      isDisabled: () => managerService.isNew (),
      clickAction: () => !managerService.isReadOnly() && !managerService.isNew() && managerService.saveAs()
    },
    {
      getText: () => $translate.instant("TOOLBAR.Export"),
      getIcon: () => "fa-arrow-circle-down",
      isVisible: () => exportService.canExport(),
      children: [
        {
          getText: () => $translate.instant("TOOLBAR.ExportToBpmn"),
          clickAction: () => exportService.exportToFile()
        },
        {
          getText: () => $translate.instant("TOOLBAR.ExportToSvg"),
          clickAction: () => exportService.exportToSVG(),
        }
      ]
    }
    ]
  });

}

angular
.module("cremaPDE.processModeler")
.run(registerSaveExportCommand)
;
