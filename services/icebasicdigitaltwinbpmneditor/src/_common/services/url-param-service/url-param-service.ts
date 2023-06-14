import * as angular from "angular";

export interface IUrlParamService {
  getProvidedProcessId(): string;
  getProvidedAction(): string;
}

class UrlParamService implements IUrlParamService {

  /**
   * returns the provided process id, if PDE is opened with
   * url param openProcess={processId}
   * @return {string} processId
   */
  public getProvidedProcessId(): string {
    const url: string = window.location.href;
    const name = "openProcess";
    const regex: any = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results: any = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  /**
   * returns the provided action, if PDE is opened with
   * ur param action={ACTION}, e.g. action=optimisation
   * @return {string} action
   */
  public getProvidedAction(): string {
    const url: string = window.location.href;
    const name = "action";
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

angular.module("cremaPDE")
  .service("urlParamService", UrlParamService);
