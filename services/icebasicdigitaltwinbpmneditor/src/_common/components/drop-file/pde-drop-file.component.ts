import * as angular from "angular";

class DropFileController {

  static $inject = [
    "$element",
    "$document",
    "$scope"
  ];


  private _counter: number;
  public onDropFile: (event: any) => void;
  public showIndicator: boolean;


  constructor(
    private $element: ng.IAugmentedJQuery,
    private $document: ng.IDocumentService,
    private $scope: ng.IScope
  ) {
    this._counter = 0;
    this.showIndicator = false;
  }


  public $onInit(): void {

    if (!this.onDropFile) {
      return;
    }

    this.$document.on("dragover.pde-drop-file drop.pde-drop-file", (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      return false;
    });

    // first we deactive default behaviour of dragging files in the browser
    this.$element.on("dragover.pde-drop-file", (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      return false;
    });

    this.$element.on("dragenter.pde-drop-file", (e: any) => {

      const types = e.originalEvent && e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.types || [];
      if (types.length && types[0] !== "Files") {
        return;
      }

      this._counter ++;
      this.$scope.$applyAsync(() => this.showIndicator = true);

    });

    this.$element.on("dragleave.pde-drop-file", () => {

      this._counter--;
      if (this._counter <= 0) {
        this.$scope.$applyAsync(() => this.showIndicator = false);
      }

    });

    // finally, our new drop procedure, open a file by drag and drop (TODO: Ask user if open process or create as subprocess)
    this.$element.on("drop.pde-drop-file", (e: any) => {

      e.stopPropagation();
      e.preventDefault();

      this.showIndicator = false;

      const files: any[] = e.originalEvent.dataTransfer.files;
      const file: any = files[0];

      // return void, if no file is dropped on canvas
      if (!file) {
        return;
      }

      const reader: FileReader = new FileReader();
      reader.onload = () => {

        this.$scope.$applyAsync(() => {

          this.onDropFile({

            $event: {
              fileName: file.name,
              fileContents: reader.result
            }

          });

        });

      };

      reader.readAsText(file);
      return false;

    });


  }


}


class DropFileComponent {

  bindings = {
    onDropFile: "&",
  };

  controller = DropFileController;
  template = require("./pde-drop-file.component.pug");
  transclude = true;

}


angular
.module("cremaPDE.common")
.component("pdeDropFile", new DropFileComponent());