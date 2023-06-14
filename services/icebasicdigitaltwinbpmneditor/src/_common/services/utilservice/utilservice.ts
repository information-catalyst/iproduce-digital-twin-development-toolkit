import * as angular from "angular";


export interface IUtilService {
  sendRequest(method: string, url: string, data?: any, headers?: any): ng.IPromise<{}>;
}


class UtilService implements IUtilService {

  static $inject = ["$q", "$http"];

  constructor(private $q: ng.IQService, private $http: ng.IHttpService) { }

  // it does a http request
  public sendRequest(method: string, url: string, data: any, headers: any): ng.IPromise<{}> {

    return this.$q((resolve, reject) => {

      return this.$http({
        method: method,
        url: url,
        data: method !== "GET" ? data : undefined,
        params: method === "GET" ? data : undefined,
        headers: headers ? headers : undefined
      })
        .then((response: any) => {

          if (response.status < 200 || response.status > 299) {
            return reject(response.status);
          } else {
            return resolve(response.data);
          }

        })
        .catch((response: any) => {
          return reject(response.data || response.statusText || "Unknown error");
        });

    });

  }

}


angular
  .module("cremaPDE.common")
  .service("utilService", UtilService)
  ;
