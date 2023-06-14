import * as angular from "angular";

import BpmnModdle = require("bpmn-moddle");

export interface IXmlParseResult {
  definitions: BpmnJS.IModdleDefinitions;
  warnings: string[];
  xml: string;
}

export interface IXmlParserService {

  // we use this method to transform xml with annotations to moddle elements
  // packages is the list of json schemas to be used
  parseXML(packages: any, xml: string): ng.IPromise<IXmlParseResult>;

}



class XmlParserService implements IXmlParserService {

  static $inject = ["$q", "$rootScope"];

  constructor(private $q: ng.IQService, private $rootScope: ng.IRootScopeService) {
  }

  // parse xml using package
  public parseXML(packages: any, xml: string): ng.IPromise<IXmlParseResult> {

    return this.$q((resolve, reject) => {

      const moddle: BpmnJS.IBpmnModdleService = new BpmnModdle(packages);

      moddle.fromXML(xml, (err, definitions: BpmnJS.IModdleDefinitions, results: BpmnJS.IModdleImportResults) => {
        err ? reject(err.message) : resolve({
          definitions: definitions,
          warnings: results.warnings.map((r) => { return r.message; }),
          xml: xml
        });

        this.$rootScope.$digest();

      });

    });

  }



}



angular
  .module("cremaPDE.processModeler")
  .service("xmlParserService", XmlParserService)
  ;
