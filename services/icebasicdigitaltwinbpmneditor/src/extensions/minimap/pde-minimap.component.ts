import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";

import {
  ICanvasService,
  IModelingService,
  IRegistryService
} from "process-modeler";

const svgAppend = require("tiny-svg/lib/append"),
    svgAttr = require("tiny-svg/lib/attr"),
    svgClear = require("tiny-svg/lib/clear"),
    svgClone = require("tiny-svg/lib/clone"),
    svgCreate = require("tiny-svg/lib/create"),
    svgRemove = require("tiny-svg/lib/remove");


interface IMinimapState {

  isVisible: boolean;
  isMapVisible: boolean;
  isDragging: boolean;
  initialDragPosition: any;
  offsetViewport: any;
  cachedViewbox: any;
  dragger: any;
  svgClientRect: any;

}

const CROSSHAIR_CURSOR = "crosshair";
const DEFAULT_CURSOR = "inherit";
const MOVE_CURSOR = "move";

const ZOOM_SMOOTHING = 300;
const MIN_ZOOM = 4;
const MAX_ZOOM = 0.2;




function fitAspectRatio(bounds: any, targetAspectRatio: any): any {
  const aspectRatio: any = bounds.width / bounds.height;

  // assigning to bounds throws exception in IE11
  const newBounds: any = angular.extend({}, {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  });

  if (aspectRatio > targetAspectRatio) {

    // height needs to be fitted
    const height: any = newBounds.width * (1 / targetAspectRatio),
        y: any = newBounds.y - ((height - newBounds.height) / 2);

    angular.extend(newBounds, {
      y: y,
      height: height
    });

  } else if (aspectRatio < targetAspectRatio) {

    // width needs to be fitted
    const width: any = newBounds.height * targetAspectRatio,
        x: any = newBounds.x - ((width - newBounds.width) / 2);

    angular.extend(newBounds, {
      x: x,
      width: width
    });
  }

  return newBounds;
}


function map(x: any, inMin: any, inMax: any, outMin: any, outMax: any): any {
  const inRange: any = inMax - inMin,
      outRange: any = outMax - outMin;

  return (x - inMin) * outRange / inRange + outMin;
}

function mapMousePositionToDiagramPoint(position: any, canvas: ICanvasService, svg: any): any {

  // firefox returns 0 for clientWidth and clientHeight
  const boundingClientRect: any = svg.getBoundingClientRect();

  // take different aspect ratios of default layers bounding box and minimap into account
  const bBox: any = fitAspectRatio(canvas.getDefaultLayer().getBBox(), boundingClientRect.width / boundingClientRect.height);

  // map click position to diagram position
  const diagramX: any = map(position.x, 0, boundingClientRect.width, bBox.x, bBox.x + bBox.width);
  const diagramY: any = map(position.y, 0, boundingClientRect.height, bBox.y, bBox.y + bBox.height);

  return {
    x: diagramX,
    y: diagramY
  };
}


function getDjsVisual(gfx: any): any {
  return [].slice.call(gfx.childNodes).filter((childNode) => {
    return childNode.getAttribute("class") === "djs-visual";
  })[0];
}



function getOffsetViewport(diagramPoint: any, viewbox: any): any {
  const centerViewbox: any = {
    x: viewbox.x + (viewbox.width / 2),
    y: viewbox.y + (viewbox.height / 2)
  };

  return {
    x: diagramPoint.x - centerViewbox.x,
    y: diagramPoint.y - centerViewbox.y
  };
}

function setCursor(node: any, cursor: any): void {
  node.style.cursor = cursor;
}

function isConnection(element: any): void {
  return element.waypoints;
}




function setViewboxCenteredAroundPoint(point: any, canvas: ICanvasService): void {

  // get cached viewbox to preserve zoom
  const cachedViewbox: any = canvas.getViewbox(),
      cachedViewboxWidth: any = cachedViewbox.width,
      cachedViewboxHeight: any = cachedViewbox.height;

  canvas.setViewbox({
    x: point.x - cachedViewboxWidth / 2,
    y: point.y - cachedViewboxHeight / 2,
    width: cachedViewboxWidth,
    height: cachedViewboxHeight
  });
}



class MinimapController {

  static $inject = [
    "$element",
    "$document",
    "managerService",
    "canvasService",
    "modelingService",
    "registryService"
  ];

  private _state: IMinimapState;

  private _svg: any;
  private _map: any;
  private _elementsGroup: any;
  private _viewport: any;
  private _svgClientRect: any;

  constructor(
    private $element: ng.IAugmentedJQuery,
    private $document: ng.IDocumentService,
    private _managerService: IManagerService,
    private _canvas: ICanvasService,
    private _modelingService: IModelingService,
    private _registry: IRegistryService
  ) {

    this.initState();
    this.$element.addClass("with-map");

    this._managerService.onSelectedChanged(this.onModelerChanges.bind(this));

    this._canvas.onShapeAdded(this.onShapeAdded.bind(this));
    this._canvas.onConnectionAdded(this.onShapeAdded.bind(this));

    this._canvas.onShapeRemoved(this.onShapeRemoved.bind(this));
    this._canvas.onConnectionRemoved(this.onShapeRemoved.bind(this));

    this._modelingService.onChanged(this.onElementsChanged.bind(this));

    this._canvas.onViewboxChanged(this.onCanvasViewBoxChanged.bind(this));
    this._canvas.onResized(this.onCanvasResized.bind(this));

  }

  private initState(): void {

    // state is necessary for viewport dragging
    this._state = {
      isVisible: true,
      isMapVisible: true,
      isDragging: false,
      initialDragPosition: null,
      offsetViewport: null,
      cachedViewbox: null,
      dragger: null,
      svgClientRect: null
    };

  }


  private init(): void {

    this.$element.addClass("right bottom");

    this._svg = this.$element.find("#minimap-svg");
    this._map = this.$element.find(".djs-minimap-map");

    this._elementsGroup = this.$element.find("#minimap-elements-group")[0];
    this._viewport = this.$element.find(".djs-minimap-viewport");

    this._svg.on("wheel", this.onSvgWheel.bind(this));
    this._svg.on("click", this.onSvgClick.bind(this));
    this._svg = this._svg[0];

    this._viewport.on("mouseenter", this.onViewPortMouseEnter.bind(this));
    this._viewport.on("mouseleave", this.onViewPortMouseLeave.bind(this));
    this._viewport.on("mousedown", this.onViewPortMouseDown.bind(this));
    this._viewport = this._viewport[0];

    this._map.on("mouseenter", this.onMapMouseEnter.bind(this));
    this._map.on("mouseleave", this.onMapMouseLeave.bind(this));
    this._map = this._map[0];

    this.$element.on("mousedown", (evt) => evt.stopPropagation());
    this.$element.on("mouseleave", this.onMouseLeave.bind(this));

    this.$document.on("mousemove", this.onDocumentMouseMove.bind(this));
    this.$document.on("mouseup", this.onDocumentMouseUp.bind(this));

  }


  private onShapeAdded(ctx: any): void {

    // add shape on shape/connection added
    const element: any = ctx.element;
    const gfx: any = ctx.gfx;

    const djsVisual: any = getDjsVisual(gfx);

    this.addElement(element, djsVisual);
    this.update();

  }

  private onShapeRemoved(ctx: any): void {
    const element: any = ctx.element;
    this.removeElement(element);
    this.update();
  }


  private onElementsChanged(ctx: any): void {

    const elements: any = ctx.elements;

    elements.forEach((element) => {
      this.removeElement(element);

      const gfx: any = this._registry.getGraphics(element);

      if (gfx) {
        const djsVisual: any = getDjsVisual(gfx);

        if (djsVisual) {
          this.addElement(element, djsVisual);
        }
      }
    });

    this.update();
  }


  private onCanvasViewBoxChanged(): void {
    if (!this._state.isDragging) {
      this.update();
    }
  }

  private onCanvasResized(): void {
    if (!this._state.isDragging) {
      this.update();
    }

    this._svgClientRect = this._svg.getBoundingClientRect();
  }


  private onSvgWheel($event: MouseWheelEvent): void {

    // stop propagation and handle scroll differently
    event.stopPropagation();

    if (!this._svgClientRect) {
      this._svgClientRect = this._svg.getBoundingClientRect();
    }

    const diagramPoint: any = mapMousePositionToDiagramPoint({
      x: $event.clientX - this._svgClientRect.left,
      y: $event.clientY - this._svgClientRect.top
    }, this._canvas, this._svg);

    setViewboxCenteredAroundPoint(diagramPoint, this._canvas);

    const zoom: any = this._canvas.getZoom();
    const delta: any = $event.deltaY > 0 ? 100 : -100;
    this._canvas.setZoom(Math.min(Math.max(zoom - (delta / ZOOM_SMOOTHING), MAX_ZOOM), MIN_ZOOM));

    this.update();
  }


  private onDocumentMouseMove($event: MouseEvent): void {

    if (!this._svgClientRect) {
      this._svgClientRect = this._svg.getBoundingClientRect();
    }

    // set viewbox if dragging active
    if (this._state.isDragging) {
      const diagramPoint: any = mapMousePositionToDiagramPoint({
            x: $event.clientX - this._svgClientRect.left,
            y: $event.clientY - this._svgClientRect.top
          }, this._canvas, this._svg),
          viewbox: any = this._state.cachedViewbox;

      setViewboxCenteredAroundPoint({
        x: diagramPoint.x - this._state.offsetViewport.x,
        y: diagramPoint.y - this._state.offsetViewport.y
      }, this._canvas);

      // update dragger
      svgAttr(this._state.dragger, {
        x: Math.round(diagramPoint.x - (viewbox.width / 2)) - this._state.offsetViewport.x,
        y: Math.round(diagramPoint.y - (viewbox.height / 2)) - this._state.offsetViewport.y
      });
    }

  }


  private onDocumentMouseUp($event: MouseEvent): void {

    if (this._state.isDragging) {

      // remove dragger
      svgRemove(this._state.dragger);

      // show viewport
      svgAttr(this._viewport, {
        visibility: "visible"
      });

      this.update();

      // end dragging
      angular.extend(this._state, {
        isDragging: false,
        initialDragPosition: null,
        offsetViewport: null,
        cachedViewbox: null,
        dragger: null
      });

      setCursor(this.$element[0].parentNode, DEFAULT_CURSOR);
    }
  }


  private onMouseLeave($event: Event): void {
    if (this._state.isDragging) {
      setCursor(this.$element[0].parentNode, MOVE_CURSOR);
    }
  }


  private onMapMouseEnter($event: Event): void {
    if (this._state.isDragging) {
      setCursor(this.$element[0], MOVE_CURSOR);
    } else {
      setCursor(this.$element[0], CROSSHAIR_CURSOR);
    }
  }

  private onMapMouseLeave($event: Event): void {
    if (!this._state.isDragging) {
      setCursor(this.$element[0], DEFAULT_CURSOR);
    }
  }

  private onViewPortMouseEnter($event: Event): void {
    setCursor(this.$element[0], MOVE_CURSOR);
  }

  private onViewPortMouseLeave($event: Event): void {
    if (!this._state.isDragging) {
      setCursor(this.$element[0], CROSSHAIR_CURSOR);
    }
  }

  /**
   * Scroll canvas on drag
   */
  private onViewPortMouseDown($event: MouseEvent): void {

    // add dragger
    const dragger: any = svgClone($event.target);
    svgAppend(this._svg, dragger);

    if (!this._svgClientRect) {
      this._svgClientRect = this._svg.getBoundingClientRect();
    }

    const diagramPoint: any = mapMousePositionToDiagramPoint({
      x: $event.clientX - this._svgClientRect.left,
      y: $event.clientY - this._svgClientRect.top
    }, this._canvas, this._svg);

    const viewbox: any = this._canvas.getViewbox();

    const offsetViewport: any = getOffsetViewport(diagramPoint, viewbox);

    // init dragging
    angular.extend(this._state, {
      isDragging: true,
      initialDragPosition: {
        x: $event.clientX,
        y: $event.clientY
      },
      offsetViewport: offsetViewport,
      cachedViewbox: viewbox,
      dragger: dragger
    });

    // hide viewport
    svgAttr(this._viewport, "visibility", "hidden");
  }


  private onSvgClick($event: MouseEvent): void {

    if (!this._svgClientRect) {
      this._svgClientRect = (<any>$event.target).getBoundingClientRect();
    }

    const diagramPoint: any = mapMousePositionToDiagramPoint({
      x: $event.clientX - this._svgClientRect.left,
      y: $event.clientY - this._svgClientRect.top
    }, this._canvas, $event.target);

    setViewboxCenteredAroundPoint(diagramPoint, this._canvas);
    this.update();
  }



  private addElement(element: any, djsVisual: any): void {

    const clone = svgClone(djsVisual);
    svgAttr(clone, { id: element.id });
    svgAppend(this._elementsGroup, clone);

    if (!isConnection(element)) {
      svgAttr(clone, { transform: "translate(" + element.x + " " + element.y + ")" });
    }

    return clone;

  }


  private removeElement(element: any): void {

    const node = this._svg.getElementById(element.id);
    if (node) {
      svgRemove(node);
    }

  }


  private clearView(): void {
    svgClear(this._elementsGroup);
  }


  private update(): void {

    const bBox: any = this._canvas.getDefaultLayer().getBBox();
    const viewbox: any = this._canvas.getViewbox();

    // update viewbox
    if (bBox.width < viewbox.width && bBox.height < viewbox.height) {
      svgAttr(this._svg, {
        viewBox: viewbox.x + ", " + viewbox.y + ", " + viewbox.width + ", " + viewbox.height
      });
    } else {
      svgAttr(this._svg, {
        viewBox: bBox.x + ", " + bBox.y + ", " + bBox.width + ", " + bBox.height
      });
    }

    // update viewport
    svgAttr(this._viewport, {
      x: viewbox.x,
      y: viewbox.y,
      width: viewbox.width,
      height: viewbox.height
    });
  }


  private addAll(): void {

    this._registry.getAll().forEach((e: IRegistryElement) => {

      if (e.parent) {
        this.addElement(e, this._registry.getGraphics(e));
      }
    });

  }

  private getModeler(): IProcessModeler {
    return this._managerService.getModeler();
  }

  private onModelerViewChanged(): void {
    this.getModeler().isDesignView() ? this.show() : this.hide();
  }

  private onModelerChanges(): void {

    if (this.getModeler()) {

      this.initState();
      this.show();
      this.clearView();

      this.getModeler().onViewChanged(this.onModelerViewChanged.bind(this));

      this.update();
      this.addAll();
      this.onModelerViewChanged();

    } else {
      this.hide();
    }


  }



  public $onInit(): void {
    this.init();
  }



  public isVisible(): boolean {
    return this._state.isVisible;
  }

  public show(): void {
    this.$element.show();
    this._state.isVisible = true;
  }

  public hide(): void {
    this.$element.hide();
    this._state.isVisible = false;
  }


  public toggleMap(): void {
    this._state.isMapVisible = !this._state.isMapVisible;
    this.$element.toggleClass("with-map");
  }

  public isMapVisible(): boolean {
    return this._state.isMapVisible;
  }


}



class MinimapComponent implements ng.IDirective {
  controller = MinimapController;
  template = require("./pde-minimap.component.pug");
}


angular
  .module("cremaPDE.extensions")
  .component("pdeMinimap", new MinimapComponent())
  ;
