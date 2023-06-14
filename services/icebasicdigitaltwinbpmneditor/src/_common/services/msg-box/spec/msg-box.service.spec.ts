import * as angular from "angular";

import { IMsgBoxService } from "../";

describe("Message box Service", () => {

  let msgBoxService: IMsgBoxService;

  beforeEach(() => {

    angular.mock.module("cremaPDE");
    angular.mock.module("cremaPDE.common");

    angular.mock.inject((_msgBoxService_: IMsgBoxService) => msgBoxService = _msgBoxService_);

  });

  it("should initialize Message box Service", () => {
    expect(msgBoxService).toBeDefined();
  });

});
