import { CriserviceExampleService, MyType } from "./criservice_example.svc";

export class CriserviceExampleController {
  "use strict";

  static $inject = ["serviceTestService"];
  public serviceTestEntities: MyType[];

  constructor(private criserviceExampleService: CriserviceExampleService) {
    //
  }

  public getAllTest(): void {
    this.criserviceExampleService
      .getAll()
      .then((entities: MyType[]) => {
        this.serviceTestEntities = entities;

        console.log(this.serviceTestEntities);
      });
  }

  public getTest(id: string): void {
    const myId = "57ab4390611fe07a63cd7a88";
    console.log("getTest");
    this.criserviceExampleService.get(myId)
      .then((myItem: any) => {
        console.log(myItem);
      });
  }

  public saveTest(item: MyType): void {
    // console.log("saveTest");
    const newItem: MyType = {
      _id: "57ab44c7611fe07a63cd7a89",
      name: "My new created item CHANGED"
    };
    this.criserviceExampleService
      .save(newItem)
      .then((response: any) => {
        console.log("success saveTest()");
      }, (err) => {
        console.log(err);
      });
  }

  public createTest(item: MyType): void {
    // console.log("createTest");
    const newItem: MyType = {
      name: "My first item"
    };
    this.criserviceExampleService.create(newItem);
  }

  public updateTest(item: MyType): void {
    console.log("updateTest");
    const updatedItem: MyType = {
      _id: "57ab4390611fe07a63cd7a88",
      name: "Changed name"
    };

    this.criserviceExampleService.update(updatedItem);
  }

  public deleteTest(item: MyType): void {
    const myItem: MyType = {
      _id: "57ab42b5611fe07a63cd7a87",
      name: "My first item"
    };
    this.criserviceExampleService.delete(myItem);
  }
}

export class CriserviceExampleComponent implements ng.IDirective {
  template = require("./criservice_example.pug");
  controller = CriserviceExampleController;
}
