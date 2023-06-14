export interface IServiceDTO {
  _id: string;
  serviceID: string; //
  name: string; //
  owner: string; //
  description: string; //
  activationDate: number; //
  last_update: number; //
  draft: boolean; //
  serviceSchema: any[];
  linkedConcepts: ILinkedConcept[];
  serviceSoftware: string; // if specified, service is concrete
  QoS: string; //
  iconData: string; //
  iconFileName: string; //
  type: IType;
  annotation: IAnnotation;
  // system info
  cpuShares: number;
  ramMb: number;
  storageMb: number;
  port: number;
  parsedQos: IQos[];
  similarity?: number;
  svaEditHref?: string;
}

export interface IQos {
  key: string;
  value: string;
  url: string;
}

export interface ILinkedConcept {
  name: string;
  popularity: number;
  parent: string;
}

export interface IAnnotation {
  variables: string[];
  inputs: IInputs;
  outputs: IOutputs;
  preconditions: IPreconditions;
  effects: IEffects;
}

export interface IInputs {
  semantic: Array<string[]>;
  textual: string;
}

export interface IOutputs extends IInputs { }

export interface IPreconditions {
  semantic: string;
  textual: string;
  parsedToArray: string[];
}

export interface IEffects extends IPreconditions { }

export interface IType {
  inputs: string[];
  outputs: string[];
}
