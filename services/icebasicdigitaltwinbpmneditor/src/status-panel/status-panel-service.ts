import * as angular from "angular";

export interface IStatusPanelButton {
  clickAction: () => void;
  getText: () => string;
  isVisible: () => boolean;

  getCss?: () => string;
  isDisabled?: () => boolean;
}


export interface IStatusPanelService {

  /**
   * Adds new button
   */
  addButton(button: IStatusPanelButton): void;

  /**
   * Returns list of buttons
   */
  getButtons(): IStatusPanelButton[];


  /**
   * Add dynamic panel
   */
  addPanel(panelMarkup: string): void;

  /**
   * Get list of registered dynamic panels
   */
  getPanels(): string[];

  /**
   * Gets the active panel to be displayed in the status panel
   */
  getActivePanel(): string;

  /**
   * Toggles the active panel to be displayed in the status panel
   */
  toggleActivePanel(panel: string): void;

  /**
   * Hook to active panel changed event
   */
  onActivePanelChanged(callback: () => void): void;

}

/**
 * This service allows dependent services adding new buttons to the main toolbar
 */
class StatusPanelService implements IStatusPanelService {

  private _buttons: IStatusPanelButton[];

  private _panels: string[];
  private _activePanelChangedListeners: (() => void)[];
  private _activePanel: string;

  constructor() {
    this._buttons = [];
    this._panels = [];
    this._activePanelChangedListeners = [];
  }

  private raiseActivePanelChanged(): void {
    this._activePanelChangedListeners.forEach((l) => l());
  }

  /**
   * Adds new button
   */
  public addButton(button: IStatusPanelButton): void {

    if (!button) {
      throw Error("Button is required");
    }

    if (!button.isDisabled) {
      button.isDisabled = () => false;
    }

    this._buttons.push(button);
  }

  /**
   * Add dynamic panel
   */
  public addPanel(panelMarkup: string): void {
    if (!panelMarkup) {
      throw Error("Panel markup is required");
    }
    this._panels.push(panelMarkup);
  }

  /**
   * Returns list of buttons
   */
  public getButtons(): IStatusPanelButton[] {
    return this._buttons;
  }

  /**
   * Returns list of dynamic panels
   */
  public getPanels(): string[] {
    return this._panels;
  }

  /**
   * Gets the active panel to be displayed in the status panel
   */
  public getActivePanel(): string {
    return this._activePanel;
  }

  /**
   * Toggles the active panel to be displayed in the status panel
   */
  public toggleActivePanel(panel: string): void {

    if (!panel) {
      throw Error("Panel is required");
    }

    this._activePanel = this._activePanel === panel ? "" : panel;
    this.raiseActivePanelChanged();
  }

  /**
   * Hook to active panel changed event
   */
  public onActivePanelChanged(callback: () => void): void {
    this._activePanelChangedListeners.push(callback);
  }

}


angular
  .module("cremaPDE.statusPanel")
  .service("statusPanelService", StatusPanelService);
