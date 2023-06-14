import * as angular from "angular";

export enum ProcessMessageType {
  Information,
  Warning
}

export interface IProcessMessage {
  id: string;
  title: string;
  type: ProcessMessageType;
}


export interface IProcessMessagesService {

  /**
   * Add new message to list of process messages
   */
  addMessage(message: IProcessMessage): void;

  /**
   * Remove message by id
   */
  removeMessage(messageId: string): void;

  /**
   * Get list of messages
   */
  getMessages(): IProcessMessage[];

}




class ProcessMessagesService implements IProcessMessagesService {

  // dictionary of documents -=> messages
  private _messages: IProcessMessage[];

  constructor() {
    this._messages = [];
  }


  private messageIdExists(messageId: string): boolean {
    return this._messages.filter((m) => m.id === messageId).length > 0;
  }

  /**
   * Add new message to list of process messages
   */
  public addMessage(message: IProcessMessage): void {

    if (!this.messageIdExists(message.id)) {
      this._messages.push(message);
    }

  }

  /**
   * Remove message by id
   */
  public removeMessage(messageId: string): void {
    this._messages = this._messages.filter((m) => m.id !== messageId);
  }

  /**
   * Get list of messages
   */
  public getMessages(): IProcessMessage[] {
    return this._messages;
  }

}


angular
  .module("cremaPDE.processManager")
  .service("processMessagesService", ProcessMessagesService)
  ;
