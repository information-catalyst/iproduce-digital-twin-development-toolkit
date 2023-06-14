import * as angular from "angular";

import { IToolbarService } from "toolbar";
import { IToolsPanelService, IToolPanel } from "tools-panel";
import { IUrlParamService, ICustomizeService } from "_common";

const CUSTOMIZE_WIDTH_KEY = "tools-panel.width";
const CUSTOMIZE_VISIBLE_KEY = "tools-panel.visible";


const PROPERTIES_PANEL = "properties";
const PROCESS_STORE_PANEL = "process-store";
const OPTIMISATION_PANEL = "optimisation";
const MARKETPLACE_PANEL = "marketplace";


class ToolsPanelController {

  static $inject = [
    "$element",
    "toolbarService",
    "urlParamService",
    "customizeService",
    "toolsPanelService"
  ];

  // url param used to open a tab directly
  private _urlAction: string;
  private _visible: boolean;


  constructor(
    private $element: ng.IAugmentedJQuery,
    private _toolbarService: IToolbarService,
    private _urlParamService: IUrlParamService,
    private _customizeService: ICustomizeService,
    private _toolsPanelService: IToolsPanelService
  ) {

    const storedVisible = this._customizeService.getValue<boolean>(CUSTOMIZE_VISIBLE_KEY);
    this._visible = storedVisible == null ? true : storedVisible;

    this._toolbarService.addButtonGroup({
      alignRight: true,
      key: "toggle-tools-panel",
      buttons: [
        {
          isActive: () => this._visible,
          getIcon: () => this._visible ? "fa-arrow-right" : "fa-arrow-left",
          clickAction: this.toggleVisible.bind(this),

        }
      ]
    });

    this.updateVisibility();
  }


  private updateWidth(): void {
    const width = this._customizeService.getValue(CUSTOMIZE_WIDTH_KEY);
    this.$element.attr("style", `width:${width || 500}px;`);
  }

  private updateVisibility(): void {
    if (this._visible) {
      this.$element.attr("style", "display:flex");
      this.updateWidth();
    } else {
      this.$element.attr("style", "display:none");
    }
  }


  private toggleVisible(): void {
    this._visible = !this._visible;
    this._customizeService.setValue<boolean>(CUSTOMIZE_VISIBLE_KEY, this._visible);
    this.updateVisibility();
  }


  public $onInit(): void {

    // if url action, select panel
    this._urlAction = this._urlParamService.getProvidedAction();
    if (this._urlAction) {
      this._toolsPanelService.activateTool(this._urlAction);
    }
  }


  public isActiveTool(toolId: string): boolean {
    return this._toolsPanelService.isActiveTool(toolId);
  }


  public activateTool(tool: IToolPanel): void {
    this._toolsPanelService.activateTool(tool.id);
  }


  public getTools(): IToolPanel[] {
    return this._toolsPanelService.getAllTools();
  }

}

class ToolsPanelComponent implements ng.IDirective {
  controller = ToolsPanelController;
  template = require("./pde-tools-panel.component.pug");
}

angular
  .module("cremaPDE")
  .component("pdeToolsPanel", new ToolsPanelComponent());
