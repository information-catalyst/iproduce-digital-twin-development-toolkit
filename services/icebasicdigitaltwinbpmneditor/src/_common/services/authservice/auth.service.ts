import * as angular from "angular";

import { IAppConfig, ISpcService } from "_common";

export interface IAuthService {
  authenticate(): ng.IPromise<{}>;
}

export interface ISpcAuthenticateUserObject {
  title: string;
  username: string;
  _id: string;
}

export interface ISpcAuthenticateResponse {
  token: string;
  user: ISpcAuthenticateUserObject;
}

interface ISpcHeaders {
  headers: {
    APIKEY: string;
    Authorization?: string;
  };
}

class AuthService {
  static $inject = ["$q", "$http", "$window", "CONFIG", "spcService"];

  private APIKEY = "59559afbdae9e1075e68fa263057653b";


  constructor(
    private $q: ng.IQService,
    private $http: ng.IHttpService,
    private $window: ng.IWindowService,
    private CONFIG: IAppConfig,
    private spcService: ISpcService
  ) {
    //
  }

  private getToken(): string {
    return this.spcService.getToken();
  }


  private getRequestHeaders(): ISpcHeaders {
    const spcHeaders: ISpcHeaders = {
      headers: {
        APIKEY: this.APIKEY,
      }
    };
    spcHeaders.headers.Authorization = `Bearer ${this.getToken()}`;
    return spcHeaders;
  }

  public authenticate(): ng.IPromise<{}> {
    const deferred: ng.IDeferred<{}> = this.$q.defer();
    this.$http.post(`${this.CONFIG.SPC_ENDPOINT}/authenticate`, { domain: "crema" }, this.getRequestHeaders())
      .then((response: any) => {
        // authenticate success
        const spcResponse: ISpcAuthenticateResponse = {
          token: this.getToken(),
          user: response.data.token.user
        };
        deferred.resolve(spcResponse);
      }, (errorResponse: any) => {
        this.$window.top.location.href = "https://dashboard.crema-project.eu/login";
        deferred.reject("authentication failed");
      });
    return deferred.promise;
  }


}

angular.module("cremaPDE.common")
  .service("authService", AuthService);
