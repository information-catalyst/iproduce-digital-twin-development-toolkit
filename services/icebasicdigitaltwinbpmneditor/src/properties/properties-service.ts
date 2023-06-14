import * as angular from "angular";

import { BPMNTYPES } from "../process-modeler";

enum PropertyType {
  Boolean,
  Bounds,
  Color,
  String,
  StringLarge,
  Type,
  Annotations,
  Condition,
  Conditions,
  Script,
  COP
}

interface IPropertyDefinition {

  label?: string;

  // underlying property type
  type: PropertyType;

  // property name
  name: string;

  // regex string for matching element type, empty if common
  targetType?: RegExp;

}


interface IPropertyEditorDefinition {

  // the property type that the editor can handle
  type: PropertyType;

  // component markup
  markup: string;

  // if the editor width allows next editor in the same row (if the next also has twoInRow)
  twoInRow?: boolean;
}


export interface IEditorBindingOptions {
  propertyChangedBinding: string;
  selectionBinding: string;
  readOnlyBinding: string;
}


export interface IPropertiesService {

  /**
   * Returns the list of properties for a given BPMNJS element
   */
  getPropertiesFor(element: BpmnJS.IRegistryElement): string[];

  /**
   * Returns editors markup for the given list of properties
   */
  getEditorsMarkupFor(bindingOptions: IEditorBindingOptions, properties: string[]): string[];

}



class PropertiesService implements IPropertiesService {

  private _bindingOptions: IEditorBindingOptions;


  // list of all properties that can be modified
  private properties: IPropertyDefinition[] = [
    {
      label: "Name",
      name: "name",
      type: PropertyType.StringLarge,
      targetType: new RegExp(`^((?!${BPMNTYPES.PROCESS}).)*$`) // except bpmn:process
    },
    {
      label: "ID",
      name: "id",
      type: PropertyType.String
    },    
    {
      label: "Bounds",
      name: "bounds",
      type: PropertyType.Bounds,
      targetType: new RegExp(`^((?!${BPMNTYPES.PROCESS}).)*$`) // except bpmn:process
    },
    {
      label: "Fill",
      name: "fill",
      type: PropertyType.Color,
      targetType: new RegExp(`^((?!${BPMNTYPES.PROCESS}|${BPMNTYPES.SEQUENCE_FLOW}).)*$`) // except bpmn:process and sequence flows
    },
    {
      label: "Stroke",
      name: "stroke",
      type: PropertyType.Color,
      targetType: new RegExp(`^((?!${BPMNTYPES.PROCESS}).)*$`) // except bpmn:process
    },
    {
      label: "Annotations",
      name: "annotations",
      type: PropertyType.Annotations,
      targetType: new RegExp(`${BPMNTYPES.SERVICE_TASK}`)
    },
    {
      label: "IsExecutable",
      name: "isExecutable",
      type: PropertyType.Boolean,
      targetType: new RegExp(`${BPMNTYPES.PROCESS}`)
    },
    {
      label: "Condition",
      name: "condition",
      type: PropertyType.Condition,
      targetType: new RegExp(`${BPMNTYPES.SEQUENCE_FLOW}`)
    },
    {
      label: "Conditions",
      name: "conditions",
      type: PropertyType.Conditions,
      targetType: new RegExp(`${BPMNTYPES.EXCLUSIVE_GATEWAY}|${BPMNTYPES.INCLUSIVE_GATEWAY}`)
    },
    {
      label: "Script",
      name: "script",
      type: PropertyType.Script,
      targetType: new RegExp(`${BPMNTYPES.SCRIPT_TASK}`)
    },
    {
      label: "COP Problem",
      name: "",
      type: PropertyType.COP,
      targetType: new RegExp(`${BPMNTYPES.PROCESS}`)
    }
  ];

  private editors: IPropertyEditorDefinition[] = [
    { type: PropertyType.String, markup: "pde-text-editor" },
    { type: PropertyType.StringLarge, markup: "pde-text-area-editor" },
    { type: PropertyType.Boolean, markup: "pde-boolean-editor" },
    { type: PropertyType.Bounds, markup: "pde-bounds-editor" },
    { type: PropertyType.Annotations, markup: "pde-annotations-editor" },
    { type: PropertyType.Color, markup: "pde-color-editor", twoInRow: true },
    { type: PropertyType.Condition, markup: "pde-condition-editor" },
    { type: PropertyType.Conditions, markup: "pde-gateway-editor" },
    { type: PropertyType.Script, markup: "pde-script-editor" },
    { type: PropertyType.COP, markup: "pde-cop-editor" },
  ];


  /**
   * Returns the list of properties for a given BPMNJS element
   */
  public getPropertiesFor(element: BpmnJS.IRegistryElement): string[] {

    const list: string[] = [];
    this.properties.forEach((prop) => {
      if (!prop.targetType || prop.targetType.test(element.businessObject.$type)) {
        list.push(prop.name);
      }
    });
    return list;
  }


  /**
   * Returns editors markup for given list of properties
   */
  public getEditorsMarkupFor(bindingOptions: IEditorBindingOptions, properties: string[]): string[] {

    const list: string[] = [];
    properties.forEach((propName: string) => {

      const propertyDef: IPropertyDefinition = this.properties.filter((p) => { return p.name === propName; })[0];

      const editorDefs: IPropertyEditorDefinition[] =
        this.editors.filter((ed: IPropertyEditorDefinition) => {
          return ed.type === propertyDef.type;
        });

      if (editorDefs.length) {

        const editorDef: IPropertyEditorDefinition = editorDefs[0];

        const markup =
          `<${editorDef.markup}
            property-label='${propertyDef.label}'
            property-name='${propertyDef.name}'
            property-changed='${bindingOptions.propertyChangedBinding}'
            read-only='${bindingOptions.readOnlyBinding}'
            selected-element='${bindingOptions.selectionBinding}'
            ></${editorDef.markup}>
          `;

        list.push(markup);
      }

    });

    return list;
  }

}


angular
  .module("cremaPDE.properties")
  .service("propertiesService", PropertiesService)
  ;
