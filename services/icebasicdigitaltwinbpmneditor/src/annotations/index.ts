import * as angular from "angular";

angular.module("cremaPDE.annotations", []);

import "./crema-types";
import "./common";

import "./process-annotations.service";
import "./service-annotations.service";
import "./iope-annotations.service";
import "./pde-annotations-sync.component";
import "./constant-annotation.service";

export * from "./common";
export * from "./process-annotations.service";
export * from "./service-annotations.service";
export * from "./iope-annotations.service";
