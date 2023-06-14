import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";

// we use this service to add/remove overlays (html) to process elements (to display tooltips, optimization data and other info)
export interface IOverlayService {

  // add jquery content specified, to the given modeler, to the specific element Id
  addOverlay(data: IAddOverlay): void;

  // clear all added overlays
  clearOverlays(): void;

}

export interface IAddOverlay {
  elementId: string | BpmnJS.IRegistryElement;
  content: ng.IAugmentedJQuery;
  position: string | any;
}


class OverlayService implements IOverlayService {

  static $inject = [
    "managerService"
  ];

  // list of overlays
  private _overlays: any[];

  constructor(
    private _managerService: IManagerService
  ) {
    this._overlays = [];
  }

  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  private getOverlayService(): BpmnJS.IOverlayService {
    const modeler = this.getModeler();
    return modeler && modeler.get<BpmnJS.IOverlayService>("overlays") || null;
  }


  // add jquery content specified, to the given modeler, to the specific element Id
  public addOverlay(options: IAddOverlay): void {

    let position = options.position;
    if (position === "right") {
      position = {
        top: -200,
        right: -10
      };
    }

    const service: BpmnJS.IOverlayService = this.getOverlayService();
    this._overlays.push(service.add(options.elementId, {

      html: options.content,
      position: position

    }));

  }



  // clear all added overlays
  public clearOverlays(): void {

    const service: BpmnJS.IOverlayService = this.getOverlayService();

    // maybe modeler is being destroyed and no service, silently ignore
    if (service) {
      this._overlays.forEach((overlayId: string) => {
        service.remove(overlayId);
      });
    }

    this._overlays = [];
  }


}


angular
  .module("cremaPDE.processModeler")
  .service("overlayService", OverlayService)
  ;
