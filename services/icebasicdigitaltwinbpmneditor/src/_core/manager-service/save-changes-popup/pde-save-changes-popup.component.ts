import * as angular from "angular";

class SaveChangesPopupController {

  public close: (result: any) => void;
  public dismiss: () => void;

  public yes(): void {
    this.close( { $value: true });
  }

  public no(): void {
    this.close( { $value: false });
  }

}



class SaveChangesPopupComponent implements ng.IDirective {

  bindings = {
    close: "&",
    dismiss: "&"
  };

  controller = SaveChangesPopupController;
  template = require("./pde-save-changes-popup.component.pug");

}


angular
.module("cremaPDE.core")
.component("pdeSaveChangesPopup", new SaveChangesPopupComponent());

