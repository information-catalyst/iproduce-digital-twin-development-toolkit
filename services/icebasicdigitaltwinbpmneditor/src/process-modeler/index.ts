import * as angular from "angular";
angular.module("cremaPDE.processModeler", []);

import "./actions";
import "./align-distribute";
import "./bpmn-types";
import "./canvas";
import "./clipboard";
import "./command";
import "./copy-paste";
import "./keyboard";
import "./moddle";
import "./modeling";
import "./overlays";
import "./registry";
import "./search";
import "./save-export";
import "./selection";
import "./undo-redo";
import "./xml-parser";
import "./zoom";


import "./pde-modeler-container.component";
import "./register-view-buttons.run";


export * from "./actions";
export * from "./bpmn-types";
export * from "./canvas";
export * from "./command";
export * from "./moddle";
export * from "./modeling";
export * from "./overlays";
export * from "./registry";
export * from "./selection";
export * from "./xml-parser";
export * from "./zoom";

