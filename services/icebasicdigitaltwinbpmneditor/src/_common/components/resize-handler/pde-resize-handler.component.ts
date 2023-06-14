import * as angular from "angular";
import { ICustomizeService } from "_common";

class ResizeHandlerController {

  static $inject = [
    "$element",
    "$document",
    "customizeService"
  ];


  private _originX: number;
  private _originWidth: number;
  private _finalWidth: number;
  private _sibling: ng.IAugmentedJQuery;
  private _noop: any;

  public siblingSelector: string;
  public customizeKey: string;


  constructor(
    private $element: ng.IAugmentedJQuery,
    private $document: ng.IDocumentService,
    private _customizeService: ICustomizeService
  ) {

    this._noop = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

  }

  private mouseDown(evt: MouseEvent): void {

    if (!this._sibling.is(":visible")) {
      return;
    }

    evt.preventDefault();
    this._originX = evt.pageX;
    this._originWidth = this._sibling.width();

    this.$document.on("selectstart.pde-resize", this._noop); // disable selection
    this.$document.on("mousemove.pde-resize", this.mouseMove.bind(this));
    this.$document.on("mouseup.pde-resize", this.mouseUp.bind(this));
  }

  private offDocumentEvents(): void {
    this.$document.off("selectstart.pde-resize"); // disable selection
    this.$document.off("mousemove.pde-resize");
    this.$document.off("mouseup.pde-resize");
  }

  private mouseMove(evt: MouseEvent): void {

    evt.preventDefault();
    this._finalWidth = this._originWidth - (evt.pageX - this._originX);
    this._sibling.width(this._finalWidth);
  }

  private mouseUp(evt: MouseEvent): void {
    this._customizeService.setValue(this.customizeKey, this._finalWidth);
    this.offDocumentEvents();
  }

  public $onInit(): void {
    this.$element.on("mousedown.pde-resize", this.mouseDown.bind(this));
    this._sibling = angular.element(this.$element.siblings(this.siblingSelector)[0]);
  }

  public $onDestroy(): void {
    this.offDocumentEvents();
    this.$element.off("mousedown.pde-resize");
  }

}


class ResizeHandlerComponent {

  bindings = {
    siblingSelector: "@",
    customizeKey: "@"
  };

  controller = ResizeHandlerController;
}


angular
.module("cremaPDE.common")
.component("pdeResizeHandler", new ResizeHandlerComponent());