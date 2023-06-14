import * as angular from "angular";

import { IProcessModeler, IManagerService } from "_core";
import { IProcessMessagesService, IProcessMessage, ProcessMessageType } from "../";

class ReadonlyMessageController {

  static $inject = [
    "processMessagesService",
    "managerService"
  ];

  private _isShown: boolean;

  constructor(
    private _service: IProcessMessagesService,
    private _managerService: IManagerService,
  ) {

    this._isShown = false;

    this._managerService.onSelectedChanged(() =>  {

      if (this._managerService.isReadOnly()) {

        this._service.addMessage({
          id: "readonly",
          title: "Current process model is in read-only state. Please create a new version if you want to make further changes.",
          type: ProcessMessageType.Warning,
        });

      } else {
        this._service.removeMessage("readonly");
      }

    });

  }

}


class ReadonlyMessageComponent implements ng.IDirective {
  controller = ReadonlyMessageController;
}


angular
  .module("cremaPDE.processManager")
  .component("pdeReadonlyMessage", new ReadonlyMessageComponent())
  ;
