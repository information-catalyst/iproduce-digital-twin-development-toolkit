import * as angular from "angular";

import { ISpcService } from "../";

describe("Spc Service", () => {

  let spcService: ISpcService;

  beforeEach(() => {

    angular.mock.module("cremaPDE.common");

    angular.mock.inject((_spcService_: ISpcService) => spcService = _spcService_);

  });

  it("should initialize Spc Service", () => {
    expect(spcService).toBeDefined();
  });

});
