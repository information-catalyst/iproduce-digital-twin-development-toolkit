import * as angular from "angular";
import {ICriService, CriService, Entity} from "../criservice";
import {IUtilService, IAppConfig} from "../../";


export class Comment extends Entity {
  // ADD YOUR OBJECT PROPERTIES HERE
  name: string;
  order: number;
}

export interface ICommentService extends ICriService<Comment> { }

export class CommentService extends CriService<Comment> {
  "use strict";
  static $inject = ["utilService", "CONFIG"];

  constructor(utilService: IUtilService, APPCONFIG: IAppConfig) {
    super(utilService, APPCONFIG);
  }

  public getBucketName(): string {
    return "processModelComments";
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

angular.module("cremaPDE")
  .service("commentService", CommentService);
