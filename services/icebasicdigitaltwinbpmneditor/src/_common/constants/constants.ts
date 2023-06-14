import * as angular from "angular";

export interface IAppConstants {
  VERSION: string;
  TOOLBAR_GROUP_KEYS: string[];
}

angular.module("cremaPDE.common")
.constant("CONSTANTS", {
  VERSION: __VERSION__,
  TOOLBAR_GROUP_KEYS: [
    "new-open",
    "save-export",
    "undo-redo",
    "copy-paste",
    "search",
    "zoom",
    "align-distribute",
    "full-screen",
    "simulation",
    "language-select",
    "color-manager",
    "about",
    "toggle-tools-panel"
  ]
});

