import * as angular from "angular";

import { IColorManagerService } from "../color-manager.service";

describe("ColorManager Service", () => {

  let colorService: IColorManagerService;

  beforeEach(() => {

    angular.mock.module("cremaPDE.core");
    angular.mock.module("cremaPDE.common");
    angular.mock.module("cremaPDE.extensions");
    angular.mock.module("cremaPDE.processModeler");
    angular.mock.module("cremaPDE.toolbar");
    angular.mock.module("cremaPDE.statusPanel");


    angular.mock.inject((_colorManagerService_: IColorManagerService) => colorService = _colorManagerService_);

  });

  it("should initialize ColorManager Service", () => {
    expect(colorService).toBeDefined();
  });

});
