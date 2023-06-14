angular.
module("cremaPDE.common").
factory("$exceptionHandler", ["$log", "$injector", function($log: ng.ILogService, $injector: any): any {
  return function customExceptionHandler(exception: any, cause: any): void {
    $injector.get("toastr").error(exception);
    $log.error(exception, cause);
  };
}]);
