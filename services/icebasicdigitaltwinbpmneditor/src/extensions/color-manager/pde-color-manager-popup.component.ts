import * as angular from "angular";
import { IColorPreset } from "./";

class ColorManagerPopupController {

  public close: (result: any) => void;
  public dismiss: () => void;
  public resolve: any;
  public colorPreset: IColorPreset;
  public defaultPreset: IColorPreset;



  public $onInit(): void {
    this.colorPreset = this.resolve.colorPreset;
    this.defaultPreset = this.resolve.defaultPreset;
  }


  public applyChanges(): void {
    this.close({ $value: this.colorPreset});
  }

  public resetToDefault(): void {
    this.colorPreset = this.defaultPreset;
  }


}

class ColorManagerPopupComponent {

  bindings = {
    close: "&",
    dismiss: "&",
    resolve: "<"
  };

  controller = ColorManagerPopupController;
  template = require("./pde-color-manager-popup.component.pug");
}



angular
.module("cremaPDE.extensions")
.component("pdeColorManagerPopup", new ColorManagerPopupComponent());