import * as angular from "angular";

import { IXmlParserService, IXmlParseResult } from "../";

/*

describe("XML Parser Service", ()=> {

    var xmlParserService:IXmlParserService;
    var moddlePackages:any;

    beforeEach(()=> {

        angular.mock.module("cremaPDE");
        angular.mock.inject(($injector) => {

            xmlParserService = $injector.get("xmlParserService");

        });

    });



    it("should initialize services", () => {

        expect(xmlParserService).toBeDefined();

    });

    it("should import XML", (done) => {

        // construct using CREMA package
        moddlePackages = {
            crema: JSON.parse(fs.readFileSync(__dirname + "/../data/crema.json", "utf-8"))
        };

        // use any bpmn file
        var xml:string = fs.readFileSync(__dirname + "/../data/UC1_1A.bpmn", "utf-8");

        xmlParserService
        .parseXML(moddlePackages, xml)
        .then((results: IXmlParseResult) => {

            debugger;

            expect(results.warnings).toBeArrayOfSize(0);
            done();

        })
        .catch(() => {

            done();

        })
        ;

    });

});

*/