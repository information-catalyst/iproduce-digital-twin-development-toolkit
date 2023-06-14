import * as angular from "angular";

import { IAlignDistributeService, AlignDirection, DistributeDirection } from "../align-distribute.service";


interface IAction {
  name: string;
  iconClass: string;
  action: () => void;
}


class AlignDistributePopupController {

  static $inject = [
    "$translate",
    "alignDistributeService"
  ];

  public alignOperations: IAction[];
  public distributeOperations: IAction[];

  public close: () => void;
  public dismiss: () => void;


  constructor(
    private $translate: angular.translate.ITranslateService,
    private _service: IAlignDistributeService
  ) {

    this.alignOperations = [
      {
        name: $translate.instant("ALIGN_DISTRIBUTE.Left"),
        iconClass: "fa-align-left",
        action: () => this._service.alignElements(AlignDirection.Left)
      },

      {
        name: $translate.instant("ALIGN_DISTRIBUTE.Right"),
        iconClass: "fa-align-right",
        action: () => this._service.alignElements(AlignDirection.Right)
      },

      {
        name: $translate.instant("ALIGN_DISTRIBUTE.Top"),
        iconClass: "fa-align-left fa-rotate-90",
        action: () => this._service.alignElements(AlignDirection.Top)
      },

      {
        name: $translate.instant("ALIGN_DISTRIBUTE.Bottom"),
        iconClass: "fa-align-right fa-rotate-90",
        action: () => this._service.alignElements(AlignDirection.Bottom)
      },

      {
        name: $translate.instant("ALIGN_DISTRIBUTE.Center"),
        iconClass: "fa-align-center",
        action: () => this._service.alignElements(AlignDirection.Center)
      },

      {
        name: $translate.instant("ALIGN_DISTRIBUTE.Middle"),
        iconClass: "fa-align-center fa-rotate-90",
        action: () => this._service.alignElements(AlignDirection.Middle)
      },

    ];


    this.distributeOperations = [
      {
        name: $translate.instant("ALIGN_DISTRIBUTE.Horizontal"),
        iconClass: "fa-reorder fa-rotate-90",
        action: () => this._service.distributeElements(DistributeDirection.Horizontal)
      },

      {
        name: $translate.instant("ALIGN_DISTRIBUTE.Vertical"),
        iconClass: "fa-reorder",
        action: () => this._service.distributeElements(DistributeDirection.Vertical)
      }
    ];

  }

  public doAction(action: IAction): void {
    action.action();
    this.close();
  }


  public canAlign(): boolean {
    return this._service.canAlignElements();
  }

  public canDistribute(): boolean {
    return this._service.canDistributeElements();
  }

}



class AlignDistributePopupComponent implements ng.IDirective {

  template = require("./pde-align-distribute-popup.component.pug");

  bindings = {
    close: "&",
    dismiss: "&",
    resolve: "<"
  };

  controller = AlignDistributePopupController;

}


angular
  .module("cremaPDE.core")
  .component("pdeAlignDistributePopup", new AlignDistributePopupComponent());
