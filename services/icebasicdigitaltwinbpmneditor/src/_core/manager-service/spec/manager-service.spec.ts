import * as angular from "angular";

import { IManagerService } from "../manager.service";

describe("Manager Service", () => {

  let managerService: IManagerService;

  beforeEach(() => {

    angular.mock.module("cremaPDE.common");
    angular.mock.module("cremaPDE.core");

    angular.mock.inject((_managerService_: IManagerService) => managerService = _managerService_);

  });

  it("should initialize Manager Service", () => {
    expect(managerService).toBeDefined();
  });

});
