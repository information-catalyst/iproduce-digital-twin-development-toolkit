const ace: AceAjax.Ace = require("brace");
require("brace/mode/xml");
require("brace/mode/javascript");

class CodeEditorController {

  static $inject = [
    "$element",
    "$timeout",
  ];

  private _editor: AceAjax.Editor;
  private _wrap: boolean;
  private _updating: boolean;
  private _writePromise: any;

  public contents: string;
  public readOnly: boolean;
  public mode: string;
  public searchText: string;
  public showToolbar: boolean;

  public changed: (eventData: any) => void;

  constructor(
    private $element: ng.IAugmentedJQuery,
    private $timeout: ng.ITimeoutService
  ) {

    this._wrap = false;

  }


  private ensureEditor(): void {

    if (this._editor) {
      return;
    }

    this._editor = ace.edit(this.$element.find(".ace-editor")[0]);
    this._editor.$blockScrolling = Infinity;

    if (this.mode === "none") {
      this._editor.getSession().setUseWorker(false);
    } else {
      this._editor.getSession().setMode(`ace/mode/${this.mode || "xml"}`);
    }
    this._editor.setReadOnly(this.readOnly);

    if (!this.readOnly) {
      this._editor.addEventListener("change", (e) => {

        if (!this._updating) {

          if (this._writePromise) {
            this.$timeout.cancel(this._writePromise);
          }

          this._writePromise = this.$timeout(() => {

            this._updating = true;
            this.contents = this._editor.getSession().getValue();
            this.changed({ $event: { newValue: this.contents}});

          }, 400);

        }


      });
    }

  }

  private refreshContents(): void {
    if (this.contents) {
      this._updating = true;
      this.ensureEditor();
      this._editor.getSession().setValue(this.contents);
    }
  }

  /**
   * Component init, ensure bind parameters, initialize ACE editor
   */
  public $onInit(): void {

    if (this.mode && this.mode.length && !/javascript|none|xml/gi.test(this.mode)) {
      throw new Error(`pde code editor, mode ${this.mode} not supported`);
    }

    this.ensureEditor();

  }

  /**
   * When input contents change, refresh editor
   */
  public $onChanges(changes: any): void {

    if (changes.contents || (changes.ngShow && changes.ngShow.currentValue === true)) {

      if (!this._updating) {
        this.refreshContents();
      }

      this._updating = false;

    }

    if (changes.readOnly) {
      if (this._editor) {
        this._editor.setReadOnly(this.readOnly);
      }
    }

  }


  /**
   * Search text
   */
  public search(): void {
    this._editor.find(this.searchText);
  }


  /**
   * Returns true if wrap mode is active
   */
  public isWrapActive(): boolean {
    return this._wrap;
  }


  /**
   * Toggle wrap mode
   */
  public toggleWrap(): void {
    this._wrap = !this._wrap;
    this._editor.setOption("wrap", this._wrap);
  }


  /**
   * Component destroy, free ACE editor resources
   */
  public $onDestroy(): void {
    this._editor.destroy();
  }

}



class CodeEditorComponent implements ng.IDirective {

  bindings = {
    mode: "@",
    showToolbar: "@",
    contents: "<",
    ngShow: "<",
    readOnly: "<",
    changed: "&"
  };

  controller = CodeEditorController;
  template = require("./pde-code-editor.component.pug");

}

angular
.module("cremaPDE.common")
.component("pdeCodeEditor", new CodeEditorComponent())
;
