import * as angular from "angular";
import "angular-toastr";

angular
.module("cremaPDE.common")
.requires.push("toastr")
;

configToastr.$inject = ["toastrConfig"];
function configToastr(toastrConfig) {
  angular.extend(toastrConfig, {
    timeOut: 2000,
  });
}

// set toastr timer to 2 secs
angular
.module("cremaPDE.common")
.config(configToastr);
