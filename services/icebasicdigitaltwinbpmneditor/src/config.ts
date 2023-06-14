import * as angular from "angular";
import { IAppConfig } from "_common";

angular.module("cremaPDE.common")
  .constant("CONFIG", <IAppConfig>{

    CRI_ENDPOINT: "https://clip.ascora.eu:8443",
    DHS_ENDPOINT: "https://icemain.hopto.org:8042",
    MARKETPLACE_ENDPOINT: "https://mpm-backend.crema-project.eu",
    ODERU_ENDPOINT: "https://oderu.crema-project.eu/",
    SPC_ENDPOINT: "https://spc-clip.ascora.eu/v1/api/auth"

  });
