import * as angular from "angular";
import { ICustomizeService } from "_common";

const LANGUAGE_CUSTOMIZE_KEY = "pde.language";

export interface ILanguageSelectService {

  /**
   * Gets current language
   */
  get(): string;

  /**
   * Switches current language
   */
  set(languageKey: string): void;
}


class LanguageSelectService implements ILanguageSelectService {

  static $inject = [
    "$translate",
    "customizeService"
  ];

  constructor(
    private $translate: any,
    private _customizeService: ICustomizeService
  ) {}


  /**
   * Gets current language
   */
  public get(): string {
    return this.$translate.use();
  }

  /**
   * Switches current language
   */
  public set(languageKey: string): void {
    this._customizeService.setValue(LANGUAGE_CUSTOMIZE_KEY, languageKey);
    this.$translate.use(languageKey);
  }

}


angular
.module("cremaPDE.extensions")
.service("languageSelectService", LanguageSelectService);


loadLanguageFromCustomization.$inject = ["$translate", "customizeService"];
function loadLanguageFromCustomization($translate: any, customizeService: ICustomizeService) {

  const key = customizeService.getValue<string>(LANGUAGE_CUSTOMIZE_KEY);

  if (key) {
    $translate.use(key);
  }
}


angular
.module("cremaPDE.extensions")
.run(loadLanguageFromCustomization);


