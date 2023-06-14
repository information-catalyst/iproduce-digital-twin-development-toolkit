import * as angular from "angular";

import { ICustomizeService } from "../";

describe("Customize Service", () => {

  let customizeService: ICustomizeService;

  beforeEach(() => {

    angular.mock.module("cremaPDE");
    angular.mock.module("cremaPDE.common");

    angular.mock.inject((_customizeService_: ICustomizeService) => customizeService = _customizeService_);

  });

  it("should initialize Customize Service", () => {
    expect(customizeService).toBeDefined();
  });

});
