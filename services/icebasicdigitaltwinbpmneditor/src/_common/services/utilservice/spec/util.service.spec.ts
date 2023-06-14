import * as angular from "angular";

import { IUtilService } from "../";

describe("Util Service", () => {

  let utilService: IUtilService;

  beforeEach(() => {

    angular.mock.module("cremaPDE");
    angular.mock.module("cremaPDE.common");

    angular.mock.inject((_utilService_: IUtilService) => utilService = _utilService_);

  });

  it("should initialize Util Service", () => {
    expect(utilService).toBeDefined();
  });

});
