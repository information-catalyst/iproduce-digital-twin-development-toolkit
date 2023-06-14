import * as angular from "angular";

import { IManagerService, IProcessModeler} from "_core";

class KeyboardBindController {

  static $inject = [
    "managerService"
  ];


  constructor(
    private _managerService: IManagerService
  ) {
    this._managerService.onSelectedChanged(this.selectedModelerChanges.bind(this));
  }


  // enable/disable keyboard binding, remember that only one process can bind to keyboard
  private bindKeyboard(modeler: IProcessModeler, bind: boolean): void {

    const keyboardService: BpmnJS.IKeyboardService = modeler.get<BpmnJS.IKeyboardService>("keyboard");
    if (keyboardService != null) {
      bind === true ? keyboardService.bind(document) : keyboardService.unbind();
    }

  }


  private selectedModelerChanges(): void {

    const previousIndex = this._managerService.getPreviousIndex();
    const previousModeler = this._managerService.getModeler(previousIndex);
    if (previousModeler && !this._managerService.isReadOnly()) {
      this.bindKeyboard(previousModeler, false);
    }

    const modeler = this._managerService.getModeler();
    if (modeler && !this._managerService.isReadOnly()) {
      this.bindKeyboard(modeler, true);
    }

 }

}


class KeyboardBindComponent {
  controller = KeyboardBindController;
}


angular
.module("cremaPDE.processModeler")
.component("pdeKeyboardBind", new KeyboardBindComponent());