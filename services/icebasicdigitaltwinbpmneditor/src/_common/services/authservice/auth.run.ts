import * as angular from "angular";

import { IAuthService } from "./auth.service";


runAuthenticate.$inject = [
  "$rootScope",
  "authService",
];
function runAuthenticate(
  $rootScope: ng.IRootScopeService,
  authService: IAuthService,
): void {

  /*if (__IN_PROD__) {
    authService
    .authenticate()
    .then(() => $rootScope.$broadcast("AUTH_READY"));
  }*/

}


angular
.module("cremaPDE.common")
.run(runAuthenticate);
