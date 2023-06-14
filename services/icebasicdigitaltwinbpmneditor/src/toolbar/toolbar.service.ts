import * as angular from "angular";
import { IAppConstants } from "_common";

export interface IToolbarButton {

  /**
   * Action to perform when button is clicked
   */
  clickAction?: () => void;

  /**
   * Returns true if the button should be active
   */
  isActive?: () => boolean;

  /**
   * Returns true if the button should be visible, default true
   */
  isVisible?: () => boolean;

  /**
   * Returns true if the button should appear disabled, default false
   */
  isDisabled?: () => boolean;

  /**
   * Option function for retrieve text
   */
  getText?: () => string;

  /**
   * Option function for retrieve image
   */
  getImage?: () => string;

  /**
   * Optional icon function for retrieve icon
   */
  getIcon?: () => string;

  /**
   * Optional, list of children, in case this is a button dropdown
   */
  children?: IToolbarButton[];
}

export interface IToolbarButtonGroup {

  /**
   * Use true to align the button group to right corner of the screen
   */
  alignRight?: boolean;

  /**
   * List of buttons
   */
  buttons: IToolbarButton[];

  /**
   * Key used for button group, only registered button groups thru config can be added
   */
  key: string;

  /**
   * Returns true if the group should be visible, default true
   */
  isVisible?: () => boolean;
}


export interface IToolbarService {

  /**
   * Adds new button group
   */
  addButtonGroup(group: IToolbarButtonGroup): void;

  /**
   * Returns list of left button groups
   */
  getLeftButtonGroups(): IToolbarButtonGroup[];

  /**
   * Returns list of left button groups
   */
  getRightButtonGroups(): IToolbarButtonGroup[];
}


/**
 * This service allows dependent services adding new buttons to the main toolbar
 */
class ToolbarService {

  static $inject = [
    "CONSTANTS"
  ];

  private _leftGroups: IToolbarButtonGroup[];
  private _rightGroups: IToolbarButtonGroup[];

  private _toolbarKeys: string[];

  constructor(CONSTANTS: IAppConstants) {
    this._leftGroups = [];
    this._rightGroups = [];
    this._toolbarKeys = CONSTANTS.TOOLBAR_GROUP_KEYS;
  }


  /**
   * Ok, so the idea here is each new group must be added using the order given by config
   */
  private addSorted(arr: IToolbarButtonGroup[], group: IToolbarButtonGroup) {

    let added = false;
    const idx = this._toolbarKeys.indexOf(group.key);
    for (let i = 0; i < arr.length; i++) {

      const idt = this._toolbarKeys.indexOf(arr[i].key);
      if (idt > idx) {
        arr.splice(i, 0, group);
        added = true;
        break;
      }
    }

    // add to the end if not added
    if (!added) {
      arr.push(group);
    }

  }


  /**
   * Adds new button group
   */
  public addButtonGroup(group: IToolbarButtonGroup): void {

    if (!group) {
      throw Error("AddGroup.group is required");
    }

    if (!group.key) {
      throw Error("AddGroup.group key is required");
    }

    if (this._toolbarKeys.indexOf(group.key) < 0) {
      throw Error(`AddGroup.group key ${group.key} not found in config`);
    }

    if (!group.isVisible) {
      group.isVisible = () => true;
    }

    if (!group.alignRight) {
      group.alignRight = false;
    }

    if (!group.buttons || !group.buttons.length) {
      throw Error("AddGroup.group.buttons are required");
    }

    for (const b of group.buttons) {
      if (!b.clickAction && !b.children) {
        throw Error("AddGroup.button.click is required");
      }

      if (!b.getText && !b.getIcon) {
        throw Error("AddGroup.button either text or icon are required");
      }

      if (!b.isDisabled) {
        b.isDisabled = () => false;
      }

      if (!b.isVisible) {
        b.isVisible = () => true;
      }
    }

    // add either to left or right
    !group.alignRight ? this.addSorted(this._leftGroups, group) : this.addSorted(this._rightGroups, group);

  }

  /**
   * Returns list of left button groups
   */
  public getLeftButtonGroups(): IToolbarButtonGroup[] {
    return this._leftGroups;
  }

  /**
   * Returns list of right button groups
   */
  public getRightButtonGroups(): IToolbarButtonGroup[] {
    return this._rightGroups;
  }

}


angular
  .module("cremaPDE.toolbar")
  .service("toolbarService", ToolbarService);
