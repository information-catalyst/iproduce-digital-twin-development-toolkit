
function btn(): ng.IDirective {

  "use strict";

  return {

    restrict: "C",
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes): void => {

      // in future, filter as needed using second param, ".form-control:not([readonly])"
      element.on("click", (e: any) => {

        element.blur();

      });

    }

  };


}



angular
  .module("cremaPDE.common")
  .directive("btn", btn)
  ;
