import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";
import { ICommandStackService, IRegistryService, IOverlayService } from "process-modeler";
import * as Annotations from "annotations";
import { IMarketplaceService } from "../";



class MarketplaceRendererController {

  static $inject = [
    "$q",
    "managerService",
    "marketplaceService",
    "registryService",
    "serviceAnnotationsService",
    "overlayService",
    "commandStackService",
  ];

  private _cachedIcons: { [id: string]: string };


  constructor(
    private $q: ng.IQService,
    private _managerService: IManagerService,
    private _marketplaceService: IMarketplaceService,
    private _registryService: IRegistryService,
    private _annotationsService: Annotations.IServiceAnnotationsService,
    private _overlayService: IOverlayService,
    private _commandStackService: ICommandStackService
  ) {

    this._cachedIcons = {};
    this._commandStackService.onShapeCreate(this.onShapeCreate.bind(this));
    this._managerService.onSelectedChanged(this.determineServices.bind(this));

  }


  private loadCache(serviceIds: string[]): ng.IPromise<{}> {

    return this.$q((resolve, reject) => {

      if (!serviceIds || !serviceIds.length) {
        return resolve();
      }

      return this._marketplaceService
        .getServicesByIds(serviceIds)
        .then((services) => {
          if (services) {
            services.forEach((s) => {
              if (s) {
                this._cachedIcons[s.serviceID] = s.iconData;
              }
            });
          }

          return resolve();

        });

    });

  }


  private determineServices(serviceId?: string): void {

    const modeler = this._managerService.getModeler();
    if (!modeler) {
      return;
    }

    let implementations = this._annotationsService.getServiceImplementations({ element: null });

    if (implementations) {

      implementations = implementations.filter((i) => i.concreteService.marketplaceServiceID || i.abstractService.marketplaceServiceID);
      if (implementations.length) {

        // limit to given service Id, for partial updates
        if (serviceId) {
          implementations = implementations.filter((i) => i.implements === serviceId);
        }

        const servicesToLoad: string[] = implementations.map((i) => {

          let serviceId = i.abstractService.marketplaceServiceID && i.abstractService.marketplaceServiceID.id;
          if (!serviceId) {
            serviceId = (<any>i.concreteService.marketplaceServiceID).id;
          }

          // TODO: We can reutilize this in a marketplace annotations service
          return serviceId;
        });

        const nonCached: string[] = servicesToLoad.filter((s) => this._cachedIcons[s] ? false : true);
        this.loadCache(nonCached).then(() => {

          implementations.forEach((i, idx) => {

            const element = this._registryService.getElementById(i.implements);
            const serviceId = servicesToLoad[idx];

            if (element && this._cachedIcons[serviceId]) {

              const img = angular.element("<img/>");
              img.attr("src", "data:image/png;base64, " + this._cachedIcons[serviceId]);
              img.attr("style", "background-color: white; width: 26px; height: 26px;border-radius:4px;border:1px solid white;");

              this._overlayService.addOverlay({
                elementId: element,
                content: img,
                position: { top: 2, left: 2 },
              });
            }

          });

        });
      }
    }

  }


  private onShapeCreate(evt: BpmnJS.ICommandStackEvent): void {
    this.determineServices(evt.context.shape.id);
  }



}


class MarketplaceRendererComponent implements ng.IDirective {
  controller = MarketplaceRendererController;
}

// init component
angular
  .module("cremaPDE.marketplace")
  .component("pdeMarketplaceRenderer", new MarketplaceRendererComponent());
