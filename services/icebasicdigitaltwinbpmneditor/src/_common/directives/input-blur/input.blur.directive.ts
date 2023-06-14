
function inputBlur(): ng.IDirective {

  "use strict";

  return {

    restrict: "A",
    link: (scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes): void => {

      // in future, filter as needed using second param, ".form-control:not([readonly])"
      element.on("keypress", (e: any) => {


        if (e.which === 13) {
          element.blur();
        }

      });

    }

  };


}



angular
  .module("cremaPDE.common")
  .directive("inputBlur", inputBlur)
  ;
