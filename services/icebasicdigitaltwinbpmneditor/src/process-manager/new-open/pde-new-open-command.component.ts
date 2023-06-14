import * as angular from "angular";

import { IManagerService } from "_core";
import { IToolbarService } from "toolbar";
import { IToolsPanelService } from "tools-panel";

class NewOpenCommandController {


  static $inject = [
    "$element",
    "$scope",
    "$translate",
    "managerService",
    "toolbarService",
    "toolsPanelService"
  ];

  // this is automatically injected during onInit phase
  public onFile: (data: any) => void;


  constructor(
    private $element: ng.IAugmentedJQuery,
    private $scope: ng.IScope,
    private $translate: angular.translate.ITranslateService,
    private _managerService: IManagerService,
    private _toolbarService: IToolbarService,
    private _toolsPanelService: IToolsPanelService
  ) {

    this._toolbarService.addButtonGroup({

      key: "new-open",

      buttons: [
        {
          getText: () => $translate.instant("TOOLBAR.New"),
          getIcon: () => "fa-file-o",
          clickAction: () => this._managerService.addNewModel(),
        }
        ,
        {
          getText: () => this.$translate.instant("TOOLBAR.Open"),
          getIcon: () => "fa-folder-open-o",
          clickAction: this.doClick.bind(this),
        },
        {
          getText: () => this.$translate.instant("TOOLBAR.OpenFromStore"),
          getIcon: () => "fa-folder-open-o",
          clickAction : () => this._toolsPanelService.activateTool("process-store"),
        }
      ]
    });


  }

  public doClick(): void {
    this.$element.find("input").click();
  }

  // open process from disk
  public openFile(file: File): void {

    const reader: FileReader = new FileReader();
    reader.onload = () => {

      this.$scope.$applyAsync(() => {

        this._managerService.openModel({
          processName: file.name,
          bpmnXml: reader.result,
          lastModified: null
        });

      });

    };

    reader.readAsText(file);

  }

}


class NewOpenCommandComponent implements ng.IDirective {
  controller = NewOpenCommandController;
  template = require("./pde-new-open-command.component.pug");
}


// init component
angular
  .module("cremaPDE.processManager")
  .component("pdeNewOpenCommand", new NewOpenCommandComponent())
  ;
