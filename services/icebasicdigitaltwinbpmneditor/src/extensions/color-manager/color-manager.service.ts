import * as angular from "angular";
import { ICustomizeService } from "_common";
import { IManagerService } from "_core";
import { IRegistryService } from "process-modeler";

export interface IColorPreset {
  activityColor: string;
  eventColor: string;
  gatewayColor: string;
}


export interface IColorManagerService {
  getColorPreset(): IColorPreset;
  openPresetManager(): void;
}


const PRESET_CUSTOMIZE_KEY = "color-manager.preset";


class ColorManagerService implements IColorManagerService {

  static $inject = [
    "$uibModal",
    "managerService",
    "customizeService",
    "registryService",
  ];

  private _colorPreset: IColorPreset;
  private _defaultPreset: IColorPreset;

  constructor(
    private $uibModal: ng.ui.bootstrap.IModalService,
    private _managerService: IManagerService,
    private _customizeService: ICustomizeService,
    private _registryService: IRegistryService,
  ) {

    this._defaultPreset = {
      activityColor: "#e9f6fd",
      eventColor: "#e6f0a3",
      gatewayColor: "#ffe399"
    };

    this._colorPreset = this._customizeService.getValue<IColorPreset>(PRESET_CUSTOMIZE_KEY) || this._defaultPreset;
  }


  private updateColorPreset(preset: IColorPreset): void {

    this._colorPreset = preset;
    this._customizeService.setValue<IColorPreset>(PRESET_CUSTOMIZE_KEY, preset);

    // now update all process modelers
    this._managerService.getModelers().forEach((modeler) => {

      const gFactory: any = this._managerService.getModeler().get("graphicsFactory");

      this._registryService.getAll().forEach((e) => {
        const g = this._registryService.getGraphics(e);
        gFactory.update("shape", e, g);
      });

    });

  }


  public getColorPreset(): IColorPreset {
    return this._colorPreset;
  }


  public openPresetManager(): void {

    this.$uibModal.open({

      component: "pdeColorManagerPopup",
      size: "sm",
      resolve: {
        colorPreset: () => this._colorPreset,
        defaultPreset: () => this._defaultPreset,
      }

    }).result.then((preset) => {
      this.updateColorPreset(preset);
    })
    .catch(angular.noop);

  }



}



angular
.module("cremaPDE.extensions")
.service("colorManagerService", ColorManagerService);
