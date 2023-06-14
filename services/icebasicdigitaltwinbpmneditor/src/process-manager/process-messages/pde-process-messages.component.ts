import * as angular from "angular";

import { IProcessMessagesService, IProcessMessage, ProcessMessageType } from "./process-messages.service";

class ProcessMessageController {

  static $inject = [
    "processMessagesService"
  ];


  constructor(private _service: IProcessMessagesService) {
  }


  public get messages(): IProcessMessage[] {
    return this._service.getMessages();
  }

  public isInformationMessage(message: IProcessMessage): boolean {
    return message.type === ProcessMessageType.Information;
  }

  public isWarningMessage(message: IProcessMessage): boolean {
    return message.type === ProcessMessageType.Warning;
  }
}


class ProcessMessagesComponent implements ng.IDirective {
  controller = ProcessMessageController;
  template = require("./pde-process-messages.component.pug");
}


angular
  .module("cremaPDE.processManager")
  .component("pdeProcessMessages", new ProcessMessagesComponent())
  ;
