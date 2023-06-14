import * as angular from "angular";

/**
 * Main service for manage full screen mode
 */
export interface IFullScreenService {

  /**
   * Returns true if we're in full screen
   */
  isEnabled(): boolean;

  /**
   * Toggles from normal screen / full screen
   */
  toggle(): void;
}


/**
 * Main service for manage full screen mode
 */
class FullScreenService implements IFullScreenService {

  static $inject = [
    "$document",
    "$rootScope"
  ];

  private document: any;
  private isKeyboardAvailbleOnFullScreen: boolean;

  constructor(
    private $document: ng.IDocumentService,
    private $rootScope: ng.IRootScopeService
  ) {

    this.document = this.$document[0];

    // ensure ALLOW_KEYBOARD_INPUT is available and enabled
    this.isKeyboardAvailbleOnFullScreen = (typeof Element !== "undefined" && "ALLOW_KEYBOARD_INPUT" in Element) && (<any>Element).ALLOW_KEYBOARD_INPUT;

    // listen event on document instead of element to avoid firefox limitation
    // see https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
    this.$document.on("fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange", () => {
      this.$rootScope.$applyAsync();
    });

  }

  /**
   * Set full screen on document element
   */
  private all(): void {
    this.enable(document.documentElement);
  }


  /**
   * Set full screen on given element
   */
  private enable(element: any): void {

    if (element.requestFullScreen) {

      element.requestFullScreen();

    } else if (element.mozRequestFullScreen) {

      element.mozRequestFullScreen();

    } else if (element.webkitRequestFullscreen) {

      // Safari temporary fix
      if (/Version\/[\d]{1,2}(\.[\d]{1,2}){1}(\.(\d){1,2}){0,1} Safari/.test(navigator.userAgent)) {
        element.webkitRequestFullscreen();
      } else {
        element.webkitRequestFullscreen(this.isKeyboardAvailbleOnFullScreen);
      }

    } else if (element.msRequestFullscreen) {

      element.msRequestFullscreen();

    }
  }

  /**
   * Cancel full screen mode
   */
  private cancel(): void {

    if (this.document.cancelFullScreen) {
      this.document.cancelFullScreen();
    } else if (this.document.mozCancelFullScreen) {
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      this.document.msExitFullscreen();
    }

  }

  /**
   * Returns true if we're in full screen
   */
  public isEnabled(): boolean {
    const fullscreenElement: any = this.document.fullscreenElement || this.document.mozFullScreenElement ||
      this.document.webkitFullscreenElement || this.document.msFullscreenElement;
    return fullscreenElement ? true : false;
  }

  /**
   * Toggles from normal screen / full screen
   */
  public toggle(): void {
    this.isEnabled() ? this.cancel() : this.all();
  }
}


angular
  .module("cremaPDE.common")
  .service("fullScreenService", FullScreenService)
  ;
