import { IProcessModeler } from "_core";
import { IAnnotatedType } from "../process-modeler";


export interface IExtensions<T> extends IAnnotatedType {
  values: T[];
}


export interface IGetSetAnnotations {

  // pass true to create structure if does not exist
  create?: boolean;

  // element to get/set annotations
  element: BpmnJS.IModdleElement;
}




export interface ICremaProcess extends BpmnJS.IModdleElement {
  extensionElements: ICremaProcessExtensions;
}



// $type = bpmn:extensionElements at process level
export interface ICremaProcessExtensions extends IExtensions<ICremaMetadata> { }



// $type = crema:metadata
export interface ICremaMetadata extends IAnnotatedType {
  annotations: ICremaAnnotations;
  implementation: ICremaImplementation;
  optimization?: ICremaOptimization;
  defaults?: ICremaDefaultCollection;
}

// $type = crema:implementation
export interface ICremaImplementation extends IAnnotatedType {
  services: ICremaServiceImplementation[];
  approved: boolean;
}

// $type = crema:service
export interface ICremaServiceImplementation extends IAnnotatedType {
  abstractService: ICremaAbstractService;
  concreteService: ICremaConcreteService;
  implements: string;
  seq: number;
  usable: boolean;
}

// $type = crema:abstractService
export interface ICremaAbstractService extends IAnnotatedType {
  marketplaceServiceID: ICremaMarketplaceService;
}

// $type = crema:concreteService
export interface ICremaConcreteService extends IAnnotatedType {
  usable: boolean;
  origin: string;
  marketplaceServiceID: ICremaMarketplaceService[];
  owlsDescription: string;
  assignments: IExtensions<ICremaAssignment>;
  bindings: IExtensions<ICremaBinding>;
}

// $type = crema:MarketplaceServiceID
export interface ICremaMarketplaceService extends IAnnotatedType {
  id: string;
}

export interface ICremaAssignment extends IAnnotatedType {
  for: string;
  name: string;
  value: any;
}

export interface ICremaBinding extends IAnnotatedType {
  origin: ICremaBindingDef;
  target: ICremaBindingDef;
}

export interface ICremaBindingDef extends IAnnotatedType {
  variable?: ICremaVariable;
  env?: any;
}

export interface ICremaVariable extends IAnnotatedType {
  service: string;
  name: string;
}



// $type = bpmn:extensionElements at service level
export interface ICremaServiceExtensions extends IExtensions<ICremaAnnotations | ICremaConstantCollection> {
}

// $type = crema:annotations at process/service level
export interface ICremaAnnotations extends IAnnotatedType {
  $type: string;
  inputs: ICremaInputCollection;
  outputs: ICremaOutputCollection;
  effects: ICremaEffectCollection;
  preconditions: ICremaPreconditionCollection;
}

export interface ICremaConstantCollection {
  $type: string;
  constant: ICremaConstantExpression[];
}

export interface ICremaConstantExpression extends IAnnotatedType {
  element: ICremaElement;
}

// $type = crema:inputs
export interface ICremaInputCollection extends IAnnotatedType {
  input: ICremaInputExpression[];
}
// $type = crema:input
export interface ICremaInputExpression extends IAnnotatedType {
  element: ICremaElement;
}
// $type = crema:outputs
export interface ICremaOutputCollection extends IAnnotatedType {
  output: ICremaOutputExpression[];
}

// $type = crema:output
export interface ICremaOutputExpression extends IAnnotatedType {
  element: ICremaElement;
}
// $type = crema:preconditions
export interface ICremaPreconditionCollection extends IAnnotatedType {
  element: ICremaElement[];
  expr: ICremaExpression;
}
export interface ICremaExpression extends IAnnotatedType {
  element: ICremaElement[];
}
// $type = crema:effects
export interface ICremaEffectCollection extends IAnnotatedType {
  element: ICremaElement[];
  expr: ICremaExpression;
}

// $type = crema:element
export interface ICremaElement extends IAnnotatedType {
  name?: string;
  variable?: string;
  value: string;
}

export interface ICremaOptimization extends IAnnotatedType {
  formulation?: ICremaFormulation;
  results?: ICremaDimensionCollection;
}

export interface ICremaFormulation extends IAnnotatedType {
  value?: string;
}

export interface ICremaDimensionCollection extends IAnnotatedType {
  dimension: ICremaDimension[];
}

export interface ICremaDimension extends IAnnotatedType {
  name: string;
  value: ICremaValue;
}

export interface ICremaValue extends IAnnotatedType {
  value: any;
}

export interface ICremaDefaultCollection extends IAnnotatedType {
  defaults: ICremaDefault[];
}

export interface ICremaDefault extends IAnnotatedType {
  for: string;
  value: string;
}
