import {ICriService, CriService, Entity} from "../criservice";
import {IUtilService, IAppConfig } from "../../../";


export class MyType extends Entity {
  _id?: string;
  name: string;
}

export interface ICriserviceExampleService extends ICriService<MyType> { }

export class CriserviceExampleService extends CriService<MyType> {
  "use strict";
  static $inject = ["utilService", "CONFIG"];

  constructor(utilService: IUtilService, APPCONFIG: IAppConfig) {
    super(utilService, APPCONFIG);
  }

  public getBucketName(): string {
    return "myEntity";
  }

  public getOrganizationName(): string {
    return "crema";
  }

  public getApplicationName(): string {
    return "main";
  }

  public getOwnerName(): string {
    return "pde";
  }

}
