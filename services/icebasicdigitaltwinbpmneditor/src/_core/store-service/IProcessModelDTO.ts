import { Entity } from "_common";

// interface for a (single) Process Model
export interface IProcessModelDTO extends Entity {
    _id?: string;
    processName: string;
    company?: string;
    lastModified: Date;
    bpmnXml: string;
    bpmnSvg?: string;
    processDescription?: string;
    documentation?: string;
    processServicePlanId?: string;
}
