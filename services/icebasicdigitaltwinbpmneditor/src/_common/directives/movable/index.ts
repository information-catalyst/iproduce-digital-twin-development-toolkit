
const DIR_NAME = "movable";

movableDir.$inject = ["$document"];
function movableDir($document: ng.IDocumentService): ng.IDirective {

  return {

    link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes): void => {

      let iterationMax = 0;
      while (true) {

        const cssPos: string = element.css("position");
        if (cssPos.match(/fixed|absolute/)) {
          break;
        }

        element = element.parent();
        iterationMax++;

        if (!element.length || iterationMax === 3) {
          return;
        }

      }

      let startX = 0;
      let startY = 0;

      const pos: JQueryCoordinates = element.position();
      let x: number = pos.left;
      let y: number = pos.top;

      element.on("mousedown", `[${DIR_NAME}='${DIR_NAME}']`, (event: JQueryEventObject): void => {

        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;

        function mousemove(event: JQueryEventObject): void {

          y = event.pageY - startY;
          x = event.pageX - startX;

          element.css({
            top: y + "px",
            left: x + "px"
          });

        }

        $document.on("mousemove", mousemove);

        function mouseup(event: JQueryEventObject): void {
          $document.off("mousemove", mousemove);
          $document.off("mouseup", mouseup);
        }

        $document.on("mouseup", mouseup);

      });

    }
  };
}


angular
  .module("cremaPDE.common")
  .directive(DIR_NAME, movableDir);
