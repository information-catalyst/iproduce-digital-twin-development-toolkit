import * as angular from "angular";

// define cremaPDE minimap module
angular.module("cremaPDE.extensions", []);


import "./color-renderer";
import "./color-manager";
import "./language-select";
import "./minimap";

import "./register-global-delete";


export * from "./color-manager";
