import * as angular from "angular";
import { ICommentService, Comment } from "./comment.svc";

export class CommentController {
  "use strict";

  static $inject = ["commentService"];
  public comments: Comment[];

  constructor(private commentService: ICommentService) {
    //
  }

  public $onInit(): void {
    // SHOULD BE DELETED AFTER FIRST EXECUTION, CHECKS IF BUCKET EXISTS, OTHERWISE CREATES IT
    // this.commentService.createBucketIfNotExists();

    this.getAllTest();
  }

  public getAllTest(): void {
    this.commentService
      .getAll()
      .then((entities: Comment[]) => {
        this.comments = entities;

      });
  }

  public getTest(id: string): void {
    console.log("getTest");
    this.commentService.get(id)
      .then((myItem: any) => {
        console.log(myItem);
      });
  }

  public saveTest(item: Comment): void {
    console.log("saveTest");
    this.commentService
      .save(item)
      .then((response: any) => {
        console.log("success saveTest()");
      }, (err) => {
        console.log(err);
      });
  }

  public createTest(item: Comment): void {
    // console.log("createTest");
    const newItem: Comment = {
      name: "My first item",
      order: 1
    };
    this.commentService
      .create(newItem)
      .then(() => {
        this.getAllTest();
      });
  }

  public updateTest(item: Comment): void {
    console.log("updateTest");
    this.commentService.update(item);
  }

  public deleteTest(item: Comment): void {
    this.commentService
      .delete(item)
      .then(() => {
        this.getAllTest();
      });
  }
}

export class CommentComponent implements ng.IDirective {
  template = require("./comment.pug");
  controller = CommentController;
}

angular.module("cremaPDE")
  .component("comment", new CommentComponent());
