import * as angular from "angular";

// define cremaPDE service plans module
angular.module("cremaPDE.optimization", []);

// include components and servicePlans
import "./pde-optimization-panel.component";
import "./pde-optimization-changes.component";

import "./optimization.service";
import "./serviceplan-parser.service";
import "./serviceplan.service";

export * from "./optimization.service";
export * from "./serviceplan-parser.service";
export * from "./serviceplan.service";
