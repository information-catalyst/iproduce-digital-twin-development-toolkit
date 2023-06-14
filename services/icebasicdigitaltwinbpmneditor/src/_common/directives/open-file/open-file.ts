function OpenFileDirective(): ng.IDirective {

  return {

    scope: {
      trigger: "&"
    },

    link: (scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes): void => {

      element.on("change", (e: any) => {

        scope.$apply(() => {
          scope.trigger({ file: e.target.files[0] });
          element.val("");
        });
      });

    }

  };
}


angular
  .module("cremaPDE.common")
  .directive("openFile", OpenFileDirective);
