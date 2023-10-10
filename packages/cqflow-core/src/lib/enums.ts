export enum TernaryEnum {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  UNKNOWN = 'UNKNOWN',
}

export enum ImplType {
  YesNo = 'YesNo',
}

export enum DefinitionNodeTypeEnum {
  Start = 'Start',
  End = 'End',
  Action = 'Action',
  Branch = 'Branch',
  TrueFalse = 'TrueFalse',
  SubFlow = 'SubFlow',
  LogicTree = 'LogicTree',
  EmitData = 'EmitData',
  Narrative = 'Narrative',
  // OptionSelect = 'OptionSelect',
  CustomForm = 'CustomForm',
  FormField = 'FormField',
}

export enum ImplementationNodeTypeEnum {
  // info = 'info',
  Start = 'Start',
  End = 'End',
  Action = 'Action',
  // userDecision = 'userDecision',
  YesNo = 'YesNo',
  // textInput = 'textInput',
  // multiChoice = 'multiChoice',
  // cql = 'cql',
  // TrueFalse = 'TrueFalse',
  Narrative = 'Narrative',
  SubFlow = 'SubFlow',
  LogicTree = 'LogicTree',
  Exec = 'Exec',
  BranchChoice = 'BranchChoice',
  BranchEvaluate = 'BranchEvaluate',

  // decisionTemplate = 'decisionTemplate',
  EmitData = 'EmitData',
  // AndNode = 'AndNode',
  // OrNode = 'OrNode',
  Message = 'Message',
  // TextInput = 'TextInput',
  CustomForm = 'CustomForm',

  TextField = 'TextField',
  NumberField = 'NumberField',
  MultiOptionField = 'MultiOptionField',

  // OptionSelect = 'OptionSelect',
  // graphLink = 'graphLink',
  // narrative = 'Narrative',
  // docLink = 'docLink',
  // linearEval = 'linearEval',
  // contextEval = 'contextEval',
  // redirect = 'redirect',
  // documentation = 'documentation',
  TrueFalseLeaf = 'TrueFalseLeaf',
}

export enum FieldTypeEnum {
  Text = 'Text',
  Number = 'Number',
  MultiOption = 'MultiOption',
  //email, date, range, number, quantity
}

export enum AnswerTypeEnum {
  YesNo = 'YesNo',
  Action = 'Action',
  SingleOption = 'SingleOption',
  CustomData = 'CustomData',
  Text = 'Text',
  Number = 'Number',
  MultiOption = 'MultiOption',
}

export enum CQFlowExecutorStateEnum {
  Initiated = 'Initiated',
  Completed = 'Completed',
}

export enum LogicEnum {
  // info = 'info',
  And = 'And',
  Or = 'Or',
  Not = 'Not',
  TrueFalseLeaf = 'TrueFalseLeaf',
}

export enum NextTypeEnum {
  Unary = 'Unary',
  Binary = 'Binary',
  Multi = 'Multi',
}

export enum FlowDefinitionTypeEnum {
  NonInteractive = 'NonInteractive',
  Interactive = 'Interactive',
}

export enum ActionStatusEnum {
  Success = 'Success',
  Failed = 'Failed',
  NotTaken = 'NotTaken',
}
