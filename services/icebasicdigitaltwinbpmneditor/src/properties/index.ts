import * as angular from "angular";
// define properties module

angular.module("cremaPDE.properties", []);

import "./annotations-editor";
import "./boolean-editor";
import "./bounds-editor";
import "./color-editor";
import "./condition-editor";
import "./cop-editor";
import "./gateway-editor";
import "./script-editor";
import "./text-editor";
import "./textarea-editor";


import "./pde-properties-panel.component";
import "./properties-service";

export * from "./pde-properties-panel.component";
export * from "./properties-service";
