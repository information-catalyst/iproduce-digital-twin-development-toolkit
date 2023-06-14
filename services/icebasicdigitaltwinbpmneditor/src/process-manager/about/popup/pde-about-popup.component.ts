import * as angular from "angular";



class AboutPopupController {

  public resolve: any;
  public imageSrc: string;

  public $onInit(): void {
    this.imageSrc = this.resolve.imageSrc;
  }

}


class AboutPopupComponent implements ng.IDirective {
  bindings = {
    dismiss: "&",
    resolve: "<",
  };

  controller = AboutPopupController;
  template = require("./pde-about-popup.component.pug");
}


angular
  .module("cremaPDE.processManager")
  .component("pdeAboutPopup", new AboutPopupComponent());
