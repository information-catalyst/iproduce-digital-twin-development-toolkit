import * as angular from "angular";
import "angular-translate";

angular
  .module("cremaPDE.common")
  .requires.push("pascalprecht.translate")
  ;

configTranslate.$inject = ["$translateProvider"];
function configTranslate($translateProvider) {

  $translateProvider
    .translations("en", require("../../translations/en.json"))
    .translations("es", require("../../translations/es.json"))
    .translations("de", require("../../translations/de.json"))
    .preferredLanguage("en");

  // we may remove this if we're not going to use filters
  // https://angular-translate.github.io/docs/#/guide/19_security
  $translateProvider.useSanitizeValueStrategy("escapeParameters");

  // set english as fallback
  $translateProvider.fallbackLanguage("en");
}

angular
  .module("cremaPDE.common")
  .config(configTranslate);
