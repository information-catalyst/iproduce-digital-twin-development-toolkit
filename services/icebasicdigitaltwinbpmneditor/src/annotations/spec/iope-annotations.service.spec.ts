import * as angular from "angular";

import { IIopeAnnotationsService } from "../iope-annotations.service";

describe("IOPE Annotations Service", () => {

  let iopeService: IIopeAnnotationsService;

  beforeEach(() => {

    angular.mock.module("cremaPDE.core");
    angular.mock.module("cremaPDE.processModeler");
    angular.mock.module("cremaPDE.annotations");

    angular.mock.inject((_iopeAnnotationsService_: IIopeAnnotationsService) => iopeService = _iopeAnnotationsService_);

  });

  it("should initialize IOPE Annotations Service", () => {
    expect(iopeService).toBeDefined();
  });

});
