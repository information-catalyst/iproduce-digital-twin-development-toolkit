import * as angular from "angular";

// service for show success/error messages
export interface IMsgBoxService {
  showSuccess(message: string): void;
  showError(message: string): void;
}

class MsgBoxService implements IMsgBoxService {

  public static $inject = [
    "toastr"
  ];


  constructor(
    private toastr: any,
  ) {}



  public showSuccess(message: string): void {
    this.toastr.success(message);
  }


  public showError(message: string): void {
    this.toastr.error(message);
  }

}


angular
    .module("cremaPDE.common")
    .service("msgBoxService", MsgBoxService);
