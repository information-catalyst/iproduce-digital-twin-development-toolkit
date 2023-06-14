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

        activateTool (tool: IToolPanel): void;
        isActiveTool (toolId: string): boolean;
        getAllPanelItems (): IToolPanel[];

}

class ToolsPanelService implements IToolsPanelService {

    private _activeTool: IToolPanel;
    public tools: IToolPanel[];

    constructor() {
        this.tools = [
            { id: PROPERTIES_PANEL, title: "Properties" },
            { id: PROCESS_STORE_PANEL, title: "Process store" },
            { id: OPTIMISATION_PANEL, title: "Optimisation" },
            { id: MARKETPLACE_PANEL, title: "Marketplace" }
          ];

    }


    public getAllPanelItems (): IToolPanel[] {
        return this.tools;
    }

    public activateTool (tool: IToolPanel): void {
        this._activeTool = tool;
    }

    public isActiveTool (toolId: string ): boolean {
        return this._activeTool && this._activeTool.id === toolId;
    }

}

angular
.module ("cremaPDE")
.service ("pdeToolsPanelService",  ToolsPanelService);
