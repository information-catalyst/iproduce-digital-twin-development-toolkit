"use strict";
import { IUtilService } from "../";
import { IAppConfig } from "../../";

/* base class for entities that should be stored in the CloudStorage
** Create your own type that extends from Entity
*/
export class Entity {
  _id?: string;
}
// describes the format of a CloudStorage-Request for Create/Update
interface ICriRequest<T> {
  rawdata: T[];
  acl?: any;
}
// describes the format for a CloudStorage-Create-Request
interface ICriCreateRequest<T> extends ICriRequest<T> { }
// describes the format for a CloudStorage-Update-Request
interface ICriUpdateRequest<T> extends ICriRequest<T> { }
// response Data Interface for CloudStorage
interface ICriResponse {
  _typeName: string;
  id: string;
}
// response Data Interface for Process Create on CRI
interface ICriCreateResponse extends ICriResponse { }
// response Data Interface for Process Update on CRI
interface ICriUpdateResponse extends ICriResponse { }
// request Data Interface for Process MultiQuery on CRI
interface ICriMultiQuery {
  last_id?: string;
  limit?: number;
  query?: any;
  order_by?: JSON;
  find_one: boolean;
}
// response Data Interface for Process MultiQuery on CRI
interface ICriMultiQueryResponse {
  last_id: string;
  numRead: number;
  // values property array is holding the returned objects
  values: ICriMultiQueryResponseMember[];  // see ICRI_MultiQuery_ResponseMember
}
// member of values[] of ICRI_MultiQuery_Response
interface ICriMultiQueryResponseMember {
  id: string;
  value: any;
}
// request format for CloudStorage Bucket Creation
interface IBucket {
  bucket_name: string;
  acl?: any;
}

class CONSTANTS {
  // needs to be changed for different organisation/applications/owner
  // <org>/<app>/<owner>
  // crema/main/pde/data
  static MULTI_QUERY_DEFAULT_BODY: ICriMultiQuery = {
    find_one: false
  };

  static AUTH_HEADER: any = {
    Authorization: "Basic dGVzdHVzZXI6QzRhJiVESjVXOTR0JTl1MktiJmVeN1ZoeGg="
  };
}
// interface for this (abstract) service
export interface ICriService<T extends Entity> {
  get(id: string): ng.IPromise<T>;
  getAll(query?: ICriMultiQuery): ng.IPromise<T[]>;
  create(item: T): ng.IPromise<{}>;
  update(item: T): ng.IPromise<{}>;
  save(item: T): ng.IPromise<{}>;
  delete(item: T): ng.IPromise<boolean>;
  createBucketIfNotExists(): void;
}
// abstract service class
export abstract class CriService<T extends Entity> implements ICriService<T> {

  static $inject = ["utilService", "CONFIG"];

  constructor(private utilService: IUtilService, private APPCONFIG: IAppConfig) {

    // we should found a way to avoid doing this call any time a service is instantiated
    // this.createBucketIfNotExists();
  }

  // needs to be implemented in real service. must return a string containing Bucket Name
  public abstract getBucketName(): string;
  // needs to be implemented in real service. must return a string containing Organization Name
  public abstract getOrganizationName(): string;
  // needs to be implemented in real service. must return a string containing Application Name
  public abstract getApplicationName(): string;
  // needs to be implemented in real service. must return a string containing Owner Name
  public abstract getOwnerName(): string;

  private getBaseUrl(): string {
    return this.APPCONFIG.CRI_ENDPOINT + "/v3.0/" + this.getOrganizationName() + "/" + this.getApplicationName() + "/" + this.getOwnerName() + "/data";
  }
  // returns cri-api core url without bucket endpoint
  private getCoreUrlWithoutBucket(): string {
    return this.getBaseUrl() + "/core";
  }
  // returns cri-api core url
  private getCoreUrl(): string {
    return this.getBaseUrl() + "/core/" + this.getBucketName();
  }
  // returns cri-api query url
  private getQueryUrl(): string {
    return this.getBaseUrl() + "/query/" + this.getBucketName();
  }
  // returns cri-api info url
  private getInfoUrl(): string {
    return this.getBaseUrl() + "/info";
  }
  /* Checks if the bucket that will be used for the "real" service
  ** (configured by getEntityPath()) exists and if not, creates it
  */
  public createBucketIfNotExists(): void {
    // get all buckets
    // this.utilService
    //   .sendRequest("GET", this.getInfoUrl())
    //   .then((buckets: any) => {
    // for (const bucket of buckets) {
    //   // check for existance of bucket defined in getEntityPath()
    //   const bucketName: string = bucket.name;
    //   if (bucketName === this.getBucketName()) {
    //     return;
    //   }
    // }
    // bucket does not exist, create it now
    const newBucket: IBucket = {
      bucket_name: this.getBucketName()
    };
    this.utilService
      .sendRequest("POST", this.getCoreUrlWithoutBucket(), newBucket, CONSTANTS.AUTH_HEADER)
      .then(() => {
        return;
      }, () => {
        throw "bucket not created. Bad CRI-API Response";
      });
    // }, (err) => {
    //   console.log(err);
    // });
  }
  /* get a single item from the CloudStorage.
  ** returns either the item on success or throws an error on failure
  */
  public get(id: string): ng.IPromise<T> {
    return this.utilService
      .sendRequest("GET", this.getCoreUrl() + "/" + id, undefined, CONSTANTS.AUTH_HEADER)
      .then((item: T) => {
        return item;
      }, (err) => {
        throw "get single item failed. Bad CRI-API Response: " + err;
      });
  }
  /* uses CONSTANTS.MULTI_QUERYY_DEFAULT_BODY as default, possible to be overriden in real service
  ** returns a "clean" array, only holding the entities of this bucket
  */
  public getAll(query: ICriMultiQuery = CONSTANTS.MULTI_QUERY_DEFAULT_BODY): ng.IPromise<T[]> {
    return this.utilService
      .sendRequest("POST", this.getQueryUrl(), query, CONSTANTS.AUTH_HEADER)
      .then((response: ICriMultiQueryResponse) => {
        const entities: T[] = [];
        for (let i = 0, len: number = response.values.length; i < len; i++) {
          entities.push(response.values[i].value);
        }
        return entities;
      });
  }
  /* creates a new item in the cri,
  ** returns either id on success or throws error on failure
  */
  public create(item: T): ng.IPromise<{}> {
    const data: ICriCreateRequest<T> = {
      rawdata: []
    };
    data.rawdata.push(item);
    console.log ("URL : " + this.getCoreUrl());
    console.log ("data : " + JSON.stringify(data));
    console.log ("auth : " + JSON.stringify(CONSTANTS.AUTH_HEADER));
    return this.utilService
      .sendRequest("POST", this.getCoreUrl(), data, CONSTANTS.AUTH_HEADER)
      .then((response: ICriCreateResponse[]) => {
        item._id = response[0].id;
        return item._id;
      });
  }
  /* updates an existing item from the CloudStorage
  ** returns either true on success or throws error on failure
  */
  public update(item: T): ng.IPromise<{}> {
    const data: ICriUpdateRequest<T> = {
      rawdata: []
    };
    data.rawdata.push(item);

    return this.utilService
      .sendRequest("PUT", this.getCoreUrl() + "/" + item._id, data, CONSTANTS.AUTH_HEADER)
      .then((response: ICriUpdateResponse[]) => {
        return true;
      }, (err) => {
        throw "item could not be updated. Bad CRI-API Response: " + err;
      });
  }
  /* saves an item to the CloudStorage.
  ** It chooses either create or update, dependend on existance of _id property.
  */
  public save(item: T): ng.IPromise<{}> {
    if (item._id) {
      return this.update(item);
    } else {
      return this.create(item);
    }
  }
  /* deletes an item from the CloudStorage
  ** returns true on success or throws an error on failure
  */
  public delete(item: T): ng.IPromise<boolean> {
    return this.utilService
      .sendRequest("DELETE", this.getCoreUrl() + "/" + item._id, undefined, CONSTANTS.AUTH_HEADER)
      .then(() => {
        return true;
      }, (err) => {
        throw "item could not be deleted. Bad CRI-API Response: " + err;
      });
  }
}
