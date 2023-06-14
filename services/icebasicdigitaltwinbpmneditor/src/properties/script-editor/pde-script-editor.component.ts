
require("brace/mode/javascript");

class ScriptEditorController {

  static $inject = [
    "$scope",
    "$timeout"
  ];

  private _editor: AceAjax.Editor;

  private _isReading: boolean;
  private _isChanged: boolean;

  // current selected element in diagram
  public selectedElement: BpmnJS.IRegistryElement;
  public propertyValue: string;
  public propertyName: string;
  public propertyChanged: ({ $event: { propertyName: string, propertyValue: any }}) => void;
  public readOnly: boolean;

  // format of the script, we don't add to constants since it depends on ace module added
  public scriptFormat: string;


  /*
  ** Controller constructor
  */
  constructor(
    private $scope: ng.IScope,
    private $timeout: ng.ITimeoutService
  ) {

    this._isReading = false;
    this._isChanged = false;
    this.scriptFormat = "javascript";

    // access editor using Id
    this._editor = ace.edit("script-editor");

    this._editor.addEventListener("change", (e) => {
      this.$scope.$applyAsync(this.textChanged.bind(this));
    });

    this._editor.$blockScrolling = Infinity;
    this._editor.getSession().setMode("ace/mode/javascript");

  }


  /*
  ** Read script data from selected element
  */
  private readProperty(): void {

    if (this.selectedElement && this.selectedElement.businessObject && this.propertyName) {

      this._isReading = true;

      const value: any = this.selectedElement.businessObject.get(this.propertyName);
      this._editor.getSession().setValue(value && value.toString() || "");

      // we do this to wait ace onEditorChanged event the first time
      this.$timeout(() => {
        this._isReading = false;
      }, 200);

    }
  }

  /*
  ** User clicks on 'apply' button, update process
  */
  private writeProperty(): void {

    // update script format?
    const scriptFormat: string = <string>this.selectedElement.businessObject.get("scriptFormat");
    if (!scriptFormat || this.scriptFormat !== scriptFormat) {
      this.propertyChanged({ $event: { propertyName: "scriptFormat", propertyValue: this.scriptFormat }});
    }

    this.propertyChanged({ $event: { propertyName: this.propertyName, propertyValue: this._editor.getSession().getValue() }});
    this._isChanged = false;
  }


  /*
  * We use a timer and a IIFE to delay update the prop after user changes the field
  */
  public textChanged = (() => {

    let promise: ng.IPromise<{}>;
    return () => {

      if (!this._isReading) {
        this.$timeout.cancel(promise);
        promise = this.$timeout(this.writeProperty.bind(this), 400);
      }

    };

  })();


  /**
   * When selected element changes
   */
  public $onChanges(changes: any): void {
    if (changes.selectedElement) {
      this._editor.setReadOnly(this.readOnly);
      this.readProperty();
    }
  }


  /**
   * Free up editor resources
   */
  public $onDestroy(): void {
    if (this._editor) {
      this._editor.destroy();
    }
  }



}



class ScriptEditorComponent implements ng.IDirective {

  bindings = {
    propertyLabel: "@",
    propertyName: "@",
    propertyChanged: "&",
    readOnly: "<",
    selectedElement: "<",
  };

  controller = ScriptEditorController;
  template = require("./pde-script-editor.component.pug");
}


angular
  .module("cremaPDE.properties")
  .component("pdeScriptEditor", new ScriptEditorComponent())
  ;
