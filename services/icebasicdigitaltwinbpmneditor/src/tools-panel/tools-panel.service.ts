import * as angular from "angular";

import { IToolbarService } from "toolbar";
import { IUrlParamService, ICustomizeService } from "_common";

const PROPERTIES_PANEL = "properties";
const PROCESS_STORE_PANEL = "process-store";
const OPTIMISATION_PANEL = "optimisation";
const MARKETPLACE_PANEL = "marketplace";

export interface IToolPanel {
  id: string;
  title: string;
}

export interface IToolsPanelService {

  activateTool(toolId: string): void;
  isActiveTool(toolId: string): boolean;
  getAllTools(): IToolPanel[];
  getToolById(toolId: string): IToolPanel;

}

class ToolsPanelService implements IToolsPanelService {

  private _activeToolId: string;
  public tools: IToolPanel[];

  constructor() {
    this.tools = [
      { id: PROPERTIES_PANEL, title: "Properties" },
      { id: PROCESS_STORE_PANEL, title: "Process store" },
      { id: OPTIMISATION_PANEL, title: "Optimisation" },
      { id: MARKETPLACE_PANEL, title: "Marketplace" }
    ];

    this._activeToolId = PROPERTIES_PANEL;

  }


  public getAllTools(): IToolPanel[] {
    return this.tools;
  }

  public getToolById(toolId: string): IToolPanel {
    const ret = this.tools.filter((t) => t.id === toolId);
    return ret.length ? ret[0] : null;
  }

  public activateTool(toolId: string): void {

    const tool = this.getToolById(toolId);
    if (!tool) {
      throw new Error(`"Can't find tool with id ${toolId}"`);
    }
    this._activeToolId = toolId;
  }

  public isActiveTool(toolId: string): boolean {
    return this._activeToolId === toolId;
  }

}

angular
  .module("cremaPDE")
  .service("toolsPanelService", ToolsPanelService);