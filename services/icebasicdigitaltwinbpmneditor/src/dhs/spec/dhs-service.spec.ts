import * as angular from "angular";

import { IDhsService } from "../dhs.service";

describe("DHS Service", () => {

  let dhsService: IDhsService;

  beforeEach(() => {

    angular.mock.module("cremaPDE");
    angular.mock.module("cremaPDE.common");
    angular.mock.module("cremaPDE.dhs");

    angular.mock.inject((_dhsService_: IDhsService) => dhsService = _dhsService_);

  });

  it("should initialize DHS Service", () => {
    expect(dhsService).toBeDefined();
  });

});
