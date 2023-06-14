import * as angular from "angular";


export interface ISpcService {
  getToken(): string;
}

class SpcService {

  public getToken(): string {
    const url: string = window.location.href;
    const name = "token";
    const regex: any = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results: any = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}

angular.module("cremaPDE.common")
  .service("spcService", SpcService);
