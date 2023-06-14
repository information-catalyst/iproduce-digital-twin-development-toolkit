import * as angular from "angular";

import { IToolbarService } from "toolbar";
import { ILanguageSelectService } from "./";


addLanguageSelect.$inject = ["toolbarService", "languageSelectService"];
function addLanguageSelect(toolbarService: IToolbarService, languageSelectService: ILanguageSelectService ) {

  toolbarService.addButtonGroup({
    alignRight: true,
    key: "language-select",
    buttons: [
      {
        getText: () => languageSelectService.get().toUpperCase(),
        children: [
          {
            getText: () => "English",
            clickAction: () => languageSelectService.set("en"),
          },
          {
            getText: () => "German",
            clickAction: () => languageSelectService.set("de"),
          },
          {
            getText: () => "Spanish",
            clickAction: () => languageSelectService.set("es"),
          }
        ]
      }
    ]

  });

}


angular
.module("cremaPDE.processManager")
.run(addLanguageSelect);
