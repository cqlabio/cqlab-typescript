import { JSONSchema7 } from 'json-schema';
import {
  ImplementationNodeTypeEnum,
  ActionStatusEnum,
  TernaryEnum,
} from '../enums';
import {
  IActionAnswer,
  ICustomDataAnswer,
  IMultiOptionAnswer,
  INumberAnswer,
  IOptionAnswer,
  ITextAnswer,
  IYesNoAnswer,
} from './answers';
import {
  IFlowDefinitionNode,
  IStartNode,
  IEndNode,
  INarrativeNode,
  ITrueFalseNode,
  IEmitDataNode,
  ICustomFormNode,
  IActionNode,
  IBranchNode,
  IMultiOptionFieldNode,
  IFieldOption,
  INextMultiOption,
  ITextFieldNode,
  INumberFieldNode,
  IMultiOptionNode,
  IMultiOption,
} from '../flow-definition';

interface IBaseStep<D extends IFlowDefinitionNode> {
  stepType: ImplementationNodeTypeEnum;
  stepId: string;
  nodeDefinition: D;
  // defin: string;node
  flowDefinitionId: string;
  label?: string;
}

export interface IStartStep extends IBaseStep<IStartNode> {
  stepType: ImplementationNodeTypeEnum.Start;
  initialData?: any;
}

export interface IEndStep extends IBaseStep<IEndNode> {
  stepType: ImplementationNodeTypeEnum.End;
}

export interface INarrativeStep extends IBaseStep<INarrativeNode> {
  stepType: ImplementationNodeTypeEnum.Narrative;
  narrative: string;
}

export interface IExecStep extends IBaseStep<ITrueFalseNode> {
  stepType: ImplementationNodeTypeEnum.Exec;
  evaluation: TernaryEnum;
  answer?: IYesNoAnswer | null;
  supplementalData?: any;
}

export interface IMultiOptionStep extends IBaseStep<IMultiOptionNode> {
  stepType: ImplementationNodeTypeEnum.MultiOptionExec;
  answer: IMultiOptionAnswer | null;
  evaluation: IMultiOptionAnswer | null;
  options: IMultiOption[];
}

export interface IYesNoStep extends IBaseStep<ITrueFalseNode> {
  stepType: ImplementationNodeTypeEnum.YesNo;
  answer: IYesNoAnswer | null;
}

export interface IEmitDataStep extends IBaseStep<IEmitDataNode> {
  stepType: ImplementationNodeTypeEnum.EmitData;
  contextData: any[];
}

export interface IActionStep extends IBaseStep<IActionNode> {
  stepType: ImplementationNodeTypeEnum.Action;
  answer: IActionAnswer | null;

  statuses: Record<string, ActionStatusEnum>;
  // actionStatus: ActionStatusEnum;
}

export interface ICustomFormStep<T = any> extends IBaseStep<ICustomFormNode> {
  stepType: ImplementationNodeTypeEnum.CustomForm;
  answer?: ICustomDataAnswer<T> | null;
  evaluation?: ICustomDataAnswer<T> | null;
  jsonSchema: JSONSchema7;
}

// export interface ITextInputStep extends IBaseStep<ICustomFormNode> {
//   stepType: ImplementationNodeTypeEnum.TextInput;
//   answer: ITextAnswer | null;
// }

export interface IMultiOptionFieldStep
  extends IBaseStep<IMultiOptionFieldNode> {
  stepType: ImplementationNodeTypeEnum.MultiOptionField;
  options: IFieldOption[];
  answer?: IMultiOptionAnswer | null;
  evaluation?: IMultiOptionAnswer | null;
  min: number;
  max: number | null;
}

export interface ITextFieldStep extends IBaseStep<ITextFieldNode> {
  stepType: ImplementationNodeTypeEnum.TextField;
  answer?: ITextAnswer;
  evaluation?: ITextAnswer;
}

export interface INumberFieldStep extends IBaseStep<INumberFieldNode> {
  stepType: ImplementationNodeTypeEnum.NumberField;
  answer?: INumberAnswer;
  evaluation?: INumberAnswer;
}

export interface IBranchChoiceStep extends IBaseStep<IBranchNode> {
  stepType: ImplementationNodeTypeEnum.BranchChoice;
  options: INextMultiOption[];
  answer: IOptionAnswer | null;
  evaluation: IOptionAnswer | null;
}

export type IFlowStep =
  | IYesNoStep
  | IExecStep
  | IMultiOptionStep
  | IStartStep
  | IActionStep
  | IEmitDataStep
  | IEndStep
  | IBranchChoiceStep
  | INarrativeStep
  | ICustomFormStep
  | ITextFieldStep
  | INumberFieldStep
  | IMultiOptionFieldStep;
