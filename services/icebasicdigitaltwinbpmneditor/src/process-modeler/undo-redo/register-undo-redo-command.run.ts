import * as angular from "angular";

import { IToolbarService } from "toolbar";
import { ICommandStackService } from "../command";


registerUndoRedoCommand.$inject = [
  "toolbarService",
  "commandStackService",
];
function registerUndoRedoCommand(
  toolbarService: IToolbarService,
  commandService: ICommandStackService,
): void {


  toolbarService.addButtonGroup({

    isVisible: () => commandService.areOperationsAllowed(),

    key: "undo-redo",

    buttons: [
      {
        isDisabled: () => !commandService.canUndo(),
        clickAction: () => commandService.undoChanges(),
        getIcon: () => "fa-reply",
      },
      {
        isDisabled: () => !commandService.canRedo(),
        clickAction: () => commandService.redoChanges(),
        getIcon: () => "fa-share",
      }
    ]
  });

}



// init component
angular
.module("cremaPDE.processModeler")
.run(registerUndoRedoCommand)
;
