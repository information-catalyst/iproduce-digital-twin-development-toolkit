import * as angular from "angular";

import { IFullScreenService } from "../";

describe("Full screen Service", () => {

  let fullScreenService: IFullScreenService;

  beforeEach(() => {

    angular.mock.module("cremaPDE");
    angular.mock.module("cremaPDE.common");

    angular.mock.inject((_fullScreenService_: IFullScreenService) => fullScreenService = _fullScreenService_);

  });

  it("should initialize Full screen Service", () => {
    expect(fullScreenService).toBeDefined();
  });

});
