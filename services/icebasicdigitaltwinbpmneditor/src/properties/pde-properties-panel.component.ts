import * as angular from "angular";

import { IManagerService } from "_core";
import { ISelectionService, ICanvasService, IModelingService } from "../process-modeler";
import { IPropertiesService } from "./";



class PropertiesPanelController {

  static $inject = [
    "$element",
    "$scope",
    "$compile",
    "$timeout",
    "managerService",
    "propertiesService",
    "selectionService",
    "canvasService",
    "modelingService",
  ];

  private selection: BpmnJS.IRegistryElement;

  // array of editors to destroy
  private scopeEditors: ng.IScope[];

  private transactionCount: number;

  public ngShow: boolean;


  constructor(
    private $element: ng.IAugmentedJQuery,
    private $scope: ng.IScope,
    private $compile: ng.ICompileService,
    private $timeout: ng.ITimeoutService,
    private _managerService: IManagerService,
    private _propertiesService: IPropertiesService,
    private _selectionService: ISelectionService,
    private _canvasService: ICanvasService,
    private _modelingService: IModelingService,

  ) {

    this.transactionCount = 0;
    this.scopeEditors = [];
    // attach to selection change event
    this._selectionService.onSelectionChanged(this.onProcessSelectionChange.bind(this));
    this._modelingService.onChanged(this.onChanged.bind(this));
  }

  public $onChanges(changes: any) {
    if (this.ngShow) {
      this.onProcessSelectionChange();
    }
  }

  private onProcessSelectionChange(): void {
    if (!this.ngShow) {
      return;
    }

    let selection: BpmnJS.IRegistryElement[] = this._selectionService.get();

    // if no selection, the main process is the selected element
    if (selection.length === 0) {
      selection = [this._canvasService.getRootElement()];
    }

    const selectionSingle: BpmnJS.IRegistryElement = selection.length === 0 || selection.length > 1 ? null : selection[0];

    // element selected is the same?
    if (selectionSingle === this.selection) {
      return;
    }

    this.buildPropertiesControls(selectionSingle);
  }


  private onChanged(): void {

    // TODO: Find a better way to avoid loop in - properties panel updates - event - here
    // we need this to support undo/redo

    if (this.transactionCount <= 0) {

      this.clearData();
      this.onProcessSelectionChange();
    }

  }


  private getControlsForm(): ng.IAugmentedJQuery {
    return this.$element.find(".properties-container > form");
  }

  private clearData(): void {

    const form: ng.IAugmentedJQuery = this.getControlsForm();
    this.scopeEditors.forEach((scope) => {
      scope.$destroy();
    });

    this.scopeEditors.length = 0;
    form.empty();
    this.selection = null;
  }


  private buildPropertiesControls(selection: BpmnJS.IRegistryElement): void {
    if (!selection) {
      this.clearData();
      return;
    }

    // instead of re-creating the same elements each time, if the type is equivalent, just reuse controls and bind
    if (this.selection != null && this.selection.type === selection.type) {
      this.selection = selection;
      return;
    }

    // empty form and update selection
    this.clearData();
    this.selection = selection;

    const propEditorsMkp: string[] = this._propertiesService.getEditorsMarkupFor({
      selectionBinding: "$ctrl.selection",
      propertyChangedBinding: "$ctrl.onPropertyChanged($event)",
      readOnlyBinding: "$ctrl.isReadOnly()"
    }, this._propertiesService.getPropertiesFor(this.selection));

    const form: ng.IAugmentedJQuery = this.getControlsForm();
    propEditorsMkp.forEach((mkp: string) => {

      const scope: ng.IScope = this.$scope.$new();
      const el: ng.IAugmentedJQuery = this.$compile(mkp)(scope);

      this.scopeEditors.push(scope);
      form.append(el);

    });

  }


  public isReadOnly(): boolean {
    return this._managerService.isReadOnly();
  }


  /**
   * Confirm element change transaction
   */
  public onPropertyChanged($event: { propertyName: string, propertyValue: any, element?: any }): void {

    this.transactionCount = 1;

    try {

      this._modelingService.updateElement({
        element: $event.element || this.selection,
        propertyName: $event.propertyName,
        propertyValue: $event.propertyValue
      });

    } finally {
      this.$timeout(() => {
        this.transactionCount = 0;
      }, 100);
    }

  }

}


class PropertiesPanelComponent implements ng.IDirective {

  bindings = {
    ngShow: "<"
  };

  controller = PropertiesPanelController;
  template = require("./pde-properties-panel.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdePropertiesPanel", new PropertiesPanelComponent())
  ;
