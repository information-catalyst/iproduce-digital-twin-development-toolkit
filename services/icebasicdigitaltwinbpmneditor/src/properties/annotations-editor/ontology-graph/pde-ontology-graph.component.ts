import * as angular from "angular";

import { ISemanticConceptDTO } from "dhs";


class OntologyGraphController {

  static $inject = ["$element"];

  public concepts: ISemanticConceptDTO[];
  public keyword: string;

  constructor(private $element: ng.IAugmentedJQuery) {
  }


  private drawGraph(): void {

    const svg: HTMLElement = this.$element.find("svg")[0];

    if (!this.concepts || !this.concepts.length) {
      $(svg).empty();
      return;
    }

    // this is the radius of an abstract circle, along which we will draw the vertexes
    const innerCircleRadius = 100;

    // this is the angle between two nearest vertexes
    const rotationAngle: number = 360 / this.concepts.length;

    // this is the frame rectangle of the graph
    const frameRect: SVGRectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    frameRect.setAttribute("width", "400");
    frameRect.setAttribute("height", "300");
    frameRect.setAttribute("fill", "white");
    frameRect.setAttribute("stroke", "black");
    frameRect.setAttribute("stroke-width", "1");
    svg.appendChild(frameRect);

    // definition of the keyword vertex
    const mainVertex: SVGCircleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const xmain = 200;
    const ymain = 50;
    const radius = 10;
    mainVertex.setAttribute("cx", xmain.toString());
    mainVertex.setAttribute("cy", ymain.toString());
    mainVertex.setAttribute("r", radius.toString());
    mainVertex.setAttribute("stroke", "black");
    mainVertex.setAttribute("stroke-width", "1px");
    mainVertex.setAttribute("fill", "lightblue");

    svg.appendChild(mainVertex);

    // definition of the keyword vertex label text
    const mainVertexText: SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    mainVertexText.setAttribute("x", (xmain - Math.floor(radius / 2)).toString());
    mainVertexText.setAttribute("y", (ymain - 1.5 * radius).toString());
    mainVertexText.setAttribute("font-size", "12");
    mainVertexText.setAttribute("fill", "black");
    mainVertexText.textContent = this.keyword;
    svg.appendChild(mainVertexText);

    // angle for rotation in the cycle
    let tempAngle: number = rotationAngle;

    // a cycle for each vertex to be drawn
    this.concepts.forEach((concept) => {

      let xVertex = 0;
      let yVertex = 0;
      let angle = 0;
      let xLine = 0;
      let yLine = 0;

      // the calculation of coordinates is divided according to the quarters of the radian circle
      // 1st quarter

      if (tempAngle < 90) {
        angle = 90 - tempAngle;
        yVertex = Math.floor(ymain + innerCircleRadius - innerCircleRadius * Math.sin(angle * Math.PI / 180));
        xVertex = Math.floor(xmain + innerCircleRadius * Math.cos(angle * Math.PI / 180));
        xLine = xVertex - radius;
        yLine = yVertex;

      } else if (tempAngle >= 90 && tempAngle < 180) {

        // 2nd quarter
        angle = tempAngle - 90;
        yVertex = Math.floor(innerCircleRadius * Math.sin(angle * Math.PI / 180) + innerCircleRadius + ymain);
        xVertex = Math.floor(innerCircleRadius * Math.cos(angle * Math.PI / 180) + xmain);
        xLine = xVertex;
        yLine = yVertex - radius;

      } else if (tempAngle >= 180 && tempAngle < 270) {

        // 3rd quarter
        angle = 270 - tempAngle;
        yVertex = Math.floor(innerCircleRadius * Math.sin(angle * Math.PI / 180) + innerCircleRadius + ymain);
        xVertex = Math.floor(xmain - innerCircleRadius * Math.cos(angle * Math.PI / 180));
        xLine = xVertex;
        yLine = yVertex - radius;

      } else if (tempAngle >= 270) {

        // 4th quarter
        angle = tempAngle - 270;
        yVertex = Math.floor(ymain + innerCircleRadius - innerCircleRadius * Math.sin(angle * Math.PI / 180));
        xVertex = Math.floor(xmain - innerCircleRadius * Math.cos(angle * Math.PI / 180));
        xLine = xVertex + radius;
        yLine = yVertex;

      }


      // draw vertex according to the calculated coordinates
      const vertex: SVGCircleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      vertex.setAttribute("cx", xVertex.toString());
      vertex.setAttribute("cy", yVertex.toString());
      vertex.setAttribute("r", radius.toString());
      vertex.setAttribute("stroke", "black");
      vertex.setAttribute("stroke-width", "1px");
      // vertex.setAttribute("id", table.rows[i + 1].cells[0].textContent);
      vertex.setAttribute("fill", "lightblue");
      vertex.setAttribute("class", "myclass");

      svg.appendChild(vertex);

      // draw text label: concept and popularity
      const textLabel: SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
      if (tempAngle > 180) {
        textLabel.setAttribute("text-anchor", "end");
        textLabel.setAttribute("x", (xVertex - 1.5 * radius).toString());
        textLabel.setAttribute("y", yVertex.toString());
      } else {
        textLabel.setAttribute("x", (xVertex + 1.5 * radius).toString());
        textLabel.setAttribute("y", yVertex.toString());
      }

      textLabel.setAttribute("font-size", "12");
      textLabel.setAttribute("fill", "black");

      textLabel.textContent = concept.label + ", " + concept.popularity;
      svg.appendChild(textLabel);

      // draw line between vertexes
      const line: SVGLineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", xmain.toString());
      line.setAttribute("y1", (ymain + radius).toString());
      line.setAttribute("x2", xLine.toString());
      line.setAttribute("y2", yLine.toString());
      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", "1px");

      svg.appendChild(line);

      // move to the next vertex
      tempAngle = tempAngle + rotationAngle;

    });

  }


  public $onChanges(changes: any): void {
    this.drawGraph();
  }


}



class OntologyGraphComponent implements ng.IDirective {

  bindings = {
    concepts: "<",
    keyword: "<"
  };

  controller = OntologyGraphController;
  template = require("./pde-ontology-graph.component.pug");

}


angular
  .module("cremaPDE.properties")
  .component("pdeOntologyGraph", new OntologyGraphComponent())
  ;
