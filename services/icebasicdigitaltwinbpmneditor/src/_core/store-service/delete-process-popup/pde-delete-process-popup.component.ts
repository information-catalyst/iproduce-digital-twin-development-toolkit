
class DeleteProcessPopupComponent implements ng.IDirective {

  bindings = {
    close: "&",
    dismiss: "&"
  };

  controller = angular.noop;
  template = require("./pde-delete-process-popup.component.pug");

}


angular
  .module("cremaPDE.core")
  .component("pdeDeleteProcessPopup", new DeleteProcessPopupComponent());

