
export class BPMNTYPES {

    public static EXTENSIONS = "bpmn:ExtensionElements";

    public static PROCESS = "bpmn:Process";
    public static SUB_PROCESS = "bpmn:SubProcess";
    public static START_EVENT = "bpmn:StartEvent";
    public static END_EVENT = "bpmn:EndEvent";
    public static MESSAGE_EVENT = "bpmn:MessageEventDefinition";
    public static TIMER_EVENT = "bpmn:TimerEventDefinition";
    public static ESCALATION_EVENT = "bpmn:EscalationEventDefinition";
    public static CONDITIONAL_EVENT = "bpmn:ConditionalEventDefinition";
    public static LINKED_EVENT = "bpmn:LinkEventDefinition";
    public static ERROR_EVENT = "bpmn:ErrorEventDefinition";
    public static CANCEL_EVENT = "bpmn:CancelEventDefinition";
    public static COMPENSATE_EVENT = "bpmn:CompensateEventDefinition";
    public static SIGNAL_EVENT = "bpmn:SignalEventDefinition";
    public static MULTIPLE_EVENT = "bpmn:MultipleEventDefinition";
    public static PARALLEL_MULTIPLE_EVENT = "bpmn:ParallelMultipleEventDefinition";
    public static TERMINATE_EVENT = "bpmn:TerminateEventDefinition";
    public static INTERMEDIATE_CATCH_EVENT = "bpmn:IntermediateCatchEvent";
    public static INTERMEDIATE_THROW_EVENT = "bpmn:IntermediateThrowEvent";

    public static TASK = "bpmn:Task";
    public static SERVICE_TASK = "bpmn:ServiceTask";
    public static USER_TASK = "bpmn:UserTask";
    public static SEND_TASK = "bpmn:SendTask";
    public static RECEIVE_TASK = "bpmn:ReceiveTask";
    public static SCRIPT_TASK = "bpmn:ScriptTask";
    public static BUSINESS_RULE_TASK = "bpmn:BusinessRuleTask";

    public static INCLUSIVE_GATEWAY = "bpmn:InclusiveGateway";
    public static EXCLUSIVE_GATEWAY = "bpmn:ExclusiveGateway";
    public static COMPLEX_GATEWAY = "bpmn:ComplexGateway";
    public static PARALLEL_GATEWAY = "bpmn:ParallelGateway";
    public static EVENT_BASED_GATEWAY = "bpmn:EventBasedGateway";
    public static GATEWAY = "bpmn:Gateway";

    public static SEQUENCE_FLOW = "bpmn:SequenceFlow";
    public static FORMAL_EXPRESSION = "bpmn:FormalExpression";

    public static DATAOBJECT_REFERENCE = "bpmn:DataObjectReference";
    public static DATASTORE_REFERENCE = "bpmn:DataStoreReference";

}

