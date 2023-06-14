import * as angular from "angular";

import { IUtilService, IAppConfig } from "_common";

export interface IGetLinkedConceptsRequest {
  token: string;
  domain: string;
  method: string;
  reasoning: string;
  geography: string;
  srcSchema: string;
  concept: string;
}

export interface ISemanticConceptDTO {
  id: number;
  uri: string;
  type: string;
  ontology: string;
  comment: string;
  label: string;
  popularity: number;
  relevance: number;
  usages: number;
}

interface ILinkDTO {
  source: number;
  target: number;
  relation: string;
}

interface ILinkedConceptsResponse {
  concepts: ISemanticConceptDTO[];
  links: ILinkDTO[];
}

/**
 * DHS service is used to retrieve linked concepts for semantic annotations
 */
export interface IDhsService {

  /**
   * Get Linked concepts based on request query
   */
  getLinkedConcepts(request: IGetLinkedConceptsRequest): ng.IPromise<ISemanticConceptDTO[]>;
}



/**
 * DHS service is used to retrieve linked concepts for semantic annotations
 */
class DhsService implements IDhsService {

  static $inject = [
    "utilService",
    "$q",
    "CONFIG"
  ];


  constructor(
    private utilService: IUtilService,
    private $q: ng.IQService,
    private APPCONFIG: IAppConfig
  ) {
  }

  /**
   * Constructs DHS Endpoint
   */
  private getDhsEndpoint(): string {
    let url: string = this.APPCONFIG.DHS_ENDPOINT;
    if (!url) {
      throw "DHS Endpoint not set";
    }

    if (url.charAt(url.length - 1) !== "/") {
      url = url + "/";
    }

    return url + "dhs/";
  }


  /**
   * Returns DHS Endpoint for analyse concept operation
   */
  private getAnalyseConceptEndpoint(): string {
    return this.getDhsEndpoint() + "analyseconcept_bda";
  }


  /**
   * Get Linked concepts based on request query
   */
  public getLinkedConcepts(request: IGetLinkedConceptsRequest): ng.IPromise<ISemanticConceptDTO[]> {

    // set security token
    request.token = "mytoken5";

    return this.utilService
    .sendRequest("GET", this.getAnalyseConceptEndpoint(), request)
    .then((response: ILinkedConceptsResponse) => {

      return this.$q((resolve, reject) => {

        if (!response || !response.concepts || !response.concepts.length) {
          return resolve([]);
        }

        return resolve(response.concepts);

      });

    });

  }
}



angular
  .module("cremaPDE.dhs", [])
  .service("dhsService", DhsService)
  ;
