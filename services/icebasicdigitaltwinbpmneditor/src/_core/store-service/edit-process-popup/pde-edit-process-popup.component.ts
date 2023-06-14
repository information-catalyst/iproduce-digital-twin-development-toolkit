import * as angular from "angular";

import { IProcessModelDTO } from "_core";


class EditProcessPopupController {


  public close: (result: any) => void;
  public dismiss: () => void;
  public resolve: any;
  public isNew: boolean;

  public process: IProcessModelDTO;


  // to show alert, if no process name specified
  // not used anymore, switched to "disable button" solution
  public showError: boolean;

  constructor() {
    this.showError = false;
  }


  public $onInit(): void {

    const input = this.resolve.process;
    this.isNew = this.resolve.isNew;

    // just copy the interested fields, no need to copy the bpmnxml or svg fields
    this.process = <any>{
      processName: this.isNew ? "" : input.processName,
      processDescription: input.processDescription,
      company: input.company,
    };

  }


  public save(): void {

    if (this.process.processName) {

      this.close( { $value: this.process });

    } else {

      this.showError = true;
      // show no processName specified error
    }
  }

  public inputIsOkay(): boolean {
    return this.process.processName.length !== 0;
  }


}



class EditProcessPopupComponent implements ng.IDirective {

  bindings = {
    close: "&",
    dismiss: "&",
    resolve: "<"
  };

  controller = EditProcessPopupController;
  template = require("./pde-edit-process-popup.component.pug");

}


angular
.module("cremaPDE.core")
.component("pdeEditProcessPopup", new EditProcessPopupComponent());

