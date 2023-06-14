import * as angular from "angular";


export interface ICustomizeService {
  getValue<T>(key: string): T;
  setValue<T>(key: string, value: T): void;
}

class CustomizeService implements ICustomizeService {
  static $inject = [
    "localStorageService"
  ];

  constructor(
    private _localStorage: any
  ) {
  }


  public getValue<T>(key: string): T {
    if (!key) {
      throw new Error("Customize.Get Key is required");
    }
    return this._localStorage.get(key);
  }

  public setValue<T>(key: string, value: T): void {
    if (!key) {
      throw new Error("Customize.Set Key is required");
    }
    this._localStorage.set(key, value);
  }

}

angular.module("cremaPDE.common")
  .service("customizeService", CustomizeService);
