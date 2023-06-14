import * as angular from "angular";

angular.module("cremaPDE.validation", []);

import "./rules";
import "./validation-panel";
import "./process-validation.service";
import "./validation-rules.service";

export * from "./process-validation.service";
export * from "./validation-rules.service";
