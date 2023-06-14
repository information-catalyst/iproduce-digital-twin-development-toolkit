import * as angular from "angular";

import { IAuthService } from "../";

describe("Auth Service", () => {

  let authService: IAuthService;

  beforeEach(() => {

    angular.mock.module("cremaPDE.common");
    angular.mock.inject((_authService_: IAuthService) => authService = _authService_);

  });

  it("should initialize Auth Service", () => {
    expect(authService).toBeDefined();
  });

});
