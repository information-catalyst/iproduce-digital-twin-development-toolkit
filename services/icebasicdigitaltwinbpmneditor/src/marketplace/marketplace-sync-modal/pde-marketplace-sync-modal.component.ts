import * as angular from "angular";

class MarketplaceSyncModalController {
  close: any;
  static $inject = [];
  constructor() {
    //
  }

  closeModal(reason: string) {
    this.close({ $value: reason });
  }
}

class MarketplaceSyncModal {
  bindings = {
    close: "&",
    dismiss: "&",
    resolve: "<"
  };
  controller = MarketplaceSyncModalController;
  template = require("./pde-marketplace-sync-modal.component.pug");
}

angular.module("cremaPDE.marketplace")
  .component("pdeMarketplaceSyncModal", new MarketplaceSyncModal());
