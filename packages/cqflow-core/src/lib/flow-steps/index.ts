import { JSONSchema7 } from 'json-schema';
import {
  ImplementationNodeTypeEnum,
  ActionStatusEnum,
  TernaryEnum,
} from '../enums';
import {
  ICustomDataAnswer,
  IMultiOptionAnswer,
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
  IInputDataNode,
  IActionNode,
  IBranchNode,
  IOptionSelectNode,
  IOptionSelectNodeOption,
  INextMultiOption,
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

  actionStatus: ActionStatusEnum;
}

export interface ICustomDataInputStep extends IBaseStep<IInputDataNode> {
  stepType: ImplementationNodeTypeEnum.CustomDataInput;
  answer: ICustomDataAnswer | null;
  jsonSchema: JSONSchema7;
}

export interface ITextInputStep extends IBaseStep<IInputDataNode> {
  stepType: ImplementationNodeTypeEnum.TextInput;
  answer: ITextAnswer | null;
}

export interface IOptionSelectStep extends IBaseStep<IOptionSelectNode> {
  stepType: ImplementationNodeTypeEnum.OptionSelect;
  options: IOptionSelectNodeOption[];
  answer?: IMultiOptionAnswer | null;
  min: number;
  max: number | null;
}

export interface IBranchChoiceStep extends IBaseStep<IBranchNode> {
  stepType: ImplementationNodeTypeEnum.BranchChoice;
  options: INextMultiOption[];
  answer: IOptionAnswer | null;
}

export type IFlowStep =
  | IYesNoStep
  | IExecStep
  | IStartStep
  | IActionStep
  | IEmitDataStep
  | IEndStep
  | IBranchChoiceStep
  // | MessageStep
  | ITextInputStep
  | INarrativeStep
  | ICustomDataInputStep
  | IOptionSelectStep;
