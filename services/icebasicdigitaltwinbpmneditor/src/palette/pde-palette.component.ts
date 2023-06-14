import * as angular from "angular";

import { IProcessModeler, IManagerService } from "_core";
import { IModelingService, IActionsService, BPMNTYPES } from "../process-modeler";


class PalettePanelController {

  static $inject = [
    "$element",
    "$timeout",
    "managerService",
    "modelingService",
    "actionsService",
  ];


  public paletteTools: any[] = [

    {
      iconClassName: "bpmn-icon-hand-tool",
      click: this.activateHandTool.bind(this),
      isActive: this.isHandToolActive.bind(this),
      tooltip: "Move canvas views"
    },

    {
      iconClassName: "bpmn-icon-lasso-tool",
      click: this.activateLassoTool.bind(this),
      isActive: this.isLassoToolActive.bind(this),
      tooltip: "Select multiple elements"
    },

    {
      iconClassName: "bpmn-icon-space-tool",
      click: this.activateSpaceTool.bind(this),
      isActive: this.isSpaceToolActive.bind(this),
      tooltip: "Click to select"
    },

    {
      iconClassName: "bpmn-icon-connection-multi",
      click: this.activateConnectionTool.bind(this),
      isActive: this.isConnectionToolActive.bind(this),
      tooltip: "Click at start and then click at end point to be connected "
    },

    {
      iconClassName: "bpmn-icon-trash",
      click: this.activateDeleteTool.bind(this),
      isActive: this.isDeleteToolActive.bind(this),
      tooltip: "Click on each element to be deleted"
    }

  ];

  public paletteGroups: any[] = [
    {
      name: "Events",
      className: "bpmn-events",
      default: {
        iconClassName: "bpmn-icon-start-event-none", dataAction: BPMNTYPES.START_EVENT
      }
    },
    {
      name: "Gateways",
      className: "bpmn-gateways",
      default: {
        iconClassName: "bpmn-icon-gateway-xor", dataAction: BPMNTYPES.EXCLUSIVE_GATEWAY
      }
    },
    {
      name: "Activities",
      className: "bpmn-activities",
      default: {
        iconClassName: "bpmn-icon-task", dataAction: BPMNTYPES.TASK
      }
    }
  ];


  public extraElements: any[] = [
    {
      iconClassName: "bpmn-icon-data-object",
      dataAction: BPMNTYPES.DATAOBJECT_REFERENCE
    },
    {
      iconClassName: "bpmn-icon-data-store",
      dataAction: BPMNTYPES.DATASTORE_REFERENCE
    },
    {
      iconClassName: "bpmn-icon-subprocess-expanded",
      dataAction: BPMNTYPES.SUB_PROCESS
    },
    {
      iconClassName: "bpmn-icon-participant",
      dataAction: "ParticipantShape"
    },
  ];


  constructor(
    private $element: ng.IAugmentedJQuery,
    private $timeout: ng.ITimeoutService,
    private _managerService: IManagerService,
    private _modelingService: IModelingService,
    private _actionsService: IActionsService
  ) {
  }


  public $onInit(): void {

    this.$element.on("mousedown", (event: JQueryEventObject) => {
      event.stopPropagation();
    });

    this.$element.on("dragstart", ".palette-entry", (event: JQueryEventObject) => {

      const target: JQuery = $(event.target);

      if (this.isActive()) {

        this._modelingService.startElement({
          event: event,
          type: target.data("action"),
        });
      }

      event.preventDefault();
      return false;

    });

  }


  public isActive(): boolean {
    const modeler = this._managerService.getModeler();
    return modeler && !this._managerService.isReadOnly() && !modeler.isXmlView();
  }


  public activateHandTool(event: Event): void {
    this._actionsService.activateHandTool(event);
  }

  public isHandToolActive(): boolean {
    return this._actionsService.isHandToolActive();
  }

  public activateLassoTool(event: Event): void {
    this._actionsService.activateLassoTool(event);
  }

  public isLassoToolActive(): boolean {
    return this._actionsService.isLassoToolActive();
  }

  public activateSpaceTool(event: Event): void {
    this._actionsService.activateSpaceTool(event);
  }

  public isSpaceToolActive(): boolean {
    return this._actionsService.isSpaceToolActive();
  }

  public activateConnectionTool(event: Event): void {
    this._actionsService.activateConnectionTool(event);
  }

  public isConnectionToolActive(): boolean {
    return this._actionsService.isConnectionToolActive();
  }

  public activateDeleteTool(event: Event): void {
    this._actionsService.activateDeleteTool(event);
  }

  public isDeleteToolActive(): boolean {
    return this._actionsService.isDeleteToolActive();
  }

}



class PalettePanelComponent implements ng.IDirective {
  controller = PalettePanelController;
  template = require("./pde-palette.component.pug");
}


angular
  .module("cremaPDE.palette")
  .component("pdePalette", new PalettePanelComponent());
