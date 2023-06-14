import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";

import { IToolbarService } from "toolbar";
import { ICopyPasteService } from "./copy-paste.service";


registerCopyPasteCommand.$inject = [
  "toolbarService",
  "copyPasteService",
];
function registerCopyPasteCommand(
  toolbarService: IToolbarService,
  copyPasteService: ICopyPasteService,
): void {

  toolbarService.addButtonGroup({

    isVisible: () => copyPasteService.areOperationsAllowed(),

    key: "copy-paste",

    buttons: [
      {
        isDisabled: () => !copyPasteService.canCopy(),
        getIcon: () => "fa-copy",
        clickAction: () => copyPasteService.copy()
      },
      {
        isDisabled: () => !copyPasteService.canPaste(),
        getIcon: () => "fa-paste",
        clickAction: () => copyPasteService.paste()
      }
    ]

  });

}

angular
.module("cremaPDE.processModeler")
.run(registerCopyPasteCommand)
;
