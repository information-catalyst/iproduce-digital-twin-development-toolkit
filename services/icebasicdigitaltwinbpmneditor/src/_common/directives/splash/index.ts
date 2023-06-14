import * as angular from "angular";

splashScreenDirective.$inject = [
  "$rootScope",
  "$timeout"
];

function splashScreenDirective (
  $rootScope: ng.IRootScopeService,
  $timeout: ng.ITimeoutService
): any {

  let modelerReady = false;
  let authReady = false;


  return {

    restrict: "E",
    link: (scope, element, attrs, controller) => {


      function checkReady(): void {

        if (modelerReady && authReady) {
          $timeout(() => {
            element.addClass("hidden");
          }, 1000);
        }

      }

      $rootScope.$on("MODELER_READY", () => {

        modelerReady = true;
        checkReady();

      });


      $rootScope.$on("AUTH_READY", () => {

        authReady = true;
        checkReady();

      });


    }
  };
}


angular
.module("cremaPDE.common")
.directive("splashScreen", splashScreenDirective)
;
