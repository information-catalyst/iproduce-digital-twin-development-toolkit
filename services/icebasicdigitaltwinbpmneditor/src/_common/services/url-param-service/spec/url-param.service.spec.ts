import * as angular from "angular";

import { IUrlParamService } from "../";

describe("UrlParam Service", () => {

  let urlParamService: IUrlParamService;

  beforeEach(() => {

    angular.mock.module("cremaPDE");
    angular.mock.module("cremaPDE.common");

    angular.mock.inject((_urlParamService_: IUrlParamService) => urlParamService = _urlParamService_);

  });

  it("should initialize UrlParam Service", () => {
    expect(urlParamService).toBeDefined();
  });

});
