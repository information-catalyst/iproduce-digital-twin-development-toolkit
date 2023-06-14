import * as angular from "angular";

// define cremaPDE marketplace module
angular.module("cremaPDE.marketplace", []);

// include marketplace component and service
import "./renderer";
import "./pde-marketplace.component";
import "./marketplace-render.service";
import "./marketplace.service";
import "./marketplace-sync.service";
import "./marketplace-sync-modal";


export * from "./marketplace.service";
