import * as angular from "angular";

// init angular!
angular

// init main app and dependencies
.module("cremaPDE",
[
  "cremaPDE.annotations",
  "cremaPDE.common",
  "cremaPDE.core",
  "cremaPDE.dhs",
  "cremaPDE.extensions",
  "cremaPDE.marketplace",
  "cremaPDE.optimization",
  "cremaPDE.palette",
  "cremaPDE.processManager",
  "cremaPDE.processModeler",
  "cremaPDE.processModelStore",
  "cremaPDE.properties",
  "cremaPDE.simulation",
  "cremaPDE.statusPanel",
  "cremaPDE.toolbar",
  "cremaPDE.validation",
])
;


import "./_common";
import "./_core";

import "./process-manager";
import "./process-modeler";

import "./annotations";
import "./dhs";
import "./extensions";
import "./marketplace";
import "./palette";
import "./properties";
import "./optimization";
import "./process-model-store";
import "./simulation";
import "./status-panel";

import "./toolbar";
import "./tools-panel";
import "./validation";


require("./favicon.ico");
require("./app.less");
