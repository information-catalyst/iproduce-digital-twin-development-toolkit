import * as angular from "angular";

import { IStoreService } from "../store.service";

describe("Store Service", () => {

  let storeService: IStoreService;

  beforeEach(() => {

    angular.mock.module("cremaPDE.common");
    angular.mock.module("cremaPDE.core");

    angular.mock.inject((_storeService_: IStoreService) => storeService = _storeService_);

  });

  it("should initialize Store Service", () => {
    expect(storeService).toBeDefined();
  });

});
