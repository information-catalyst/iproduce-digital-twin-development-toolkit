import * as angular from "angular";

class DynamicContainerController {

  static $inject = [
    "$element",
    "$scope",
    "$compile",
  ];

  public elements: string[];

  constructor(
    private $element: ng.IAugmentedJQuery,
    private $scope: ng.IScope,
    private $compile: ng.ICompileService
  ) {

  }


  public $onInit(): void {

    if (!this.elements || !this.elements.length) {
      return;
    }

    this.elements.forEach((elementMarkup) => {

      const scope: ng.IScope = this.$scope.$new();
      const el: ng.IAugmentedJQuery = this.$compile(elementMarkup)(scope);

      if (!el.length) {
        throw Error(`Error compiling ${elementMarkup}, remember to put full html tags, like <test></test>`);
      }

      this.$element.append(el);

    });

  }

}


class DynamicContainerComponent implements ng.IDirective {

  bindings = {
    elements: "<"
  };
  controller = DynamicContainerController;
}


angular
  .module("cremaPDE.common")
  .component("pdeDynamicContainer", new DynamicContainerComponent())
  ;
