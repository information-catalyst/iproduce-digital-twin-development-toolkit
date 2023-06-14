import { IProcessModelDTO } from "../";


export interface IImportResult {
  warnings: IImportMessage[];
}

export interface IImportMessage {
  error: string;
  message: string;
}



// interface for publishing out modeler functions
export interface IProcessModeler extends BpmnJS.IBaseModeler {

  /**
   * Gets process modeler unique identifier
   */
  getId(): string;

  /**
   * Gets whether the process modeler is in readonly mode
   */
  isReadOnly(): boolean;

  /**
   * Activate/Deactivate process modeler
   */
  setActive(value: boolean): void;


  isDesignView(): boolean;
  isXmlView(): boolean;

  setDesignView(): void;
  setXmlView(): void;

  /**
   * Get xml data content
   */
  getXML(): ng.IPromise<string>;

  /**
   * Get svg data content
   */
  getSVG(): ng.IPromise<string>;

  /**
   * Attach to xml/design view changed event
   */
  onViewChanged(callback: () => any): void;

}

