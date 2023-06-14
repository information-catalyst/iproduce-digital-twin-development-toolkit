import * as angular from "angular";

import { IFactoryService } from "../factory.service";

describe("Factory Service", () => {

  let factoryService: IFactoryService;

  beforeEach(() => {

    angular.mock.module("cremaPDE.core");
    angular.mock.inject((_factoryService_: IFactoryService) => factoryService = _factoryService_);

  });

  it("should initialize Factory Service", () => {
    expect(factoryService).toBeDefined();
  });

});
