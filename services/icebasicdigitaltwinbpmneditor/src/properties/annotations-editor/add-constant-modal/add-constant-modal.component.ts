import * as angular from "angular";
class AddConstantModalController {
  static $inject = [];
  private close: any;
  private addConstantForm: ng.IFormController;
  private constant: string;
  public resolve: any;

  constructor(
  ) {
    //
  }

  public $onInit() {
    if (this.resolve.editConstant) {
      this.constant = this.resolve.editConstant;
    }
  }

  private closeModal() {
    this.close({ $value: this.constant });
  }
}

class AddConstantModal {
  controller = AddConstantModalController;
  template = require("./add-constant-modal.component.pug");
  bindings = {
    close: "&",
    dismiss: "&",
    resolve: "<"
  };
}

angular.module("cremaPDE.properties")
  .component("pdeAddConstantModal", new AddConstantModal());
