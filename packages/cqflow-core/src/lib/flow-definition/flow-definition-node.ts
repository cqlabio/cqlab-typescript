import {
  NextTypeEnum,
  DefinitionNodeTypeEnum,
  LogicEnum,
  ActionEnum,
} from '../enums';
import { IFormFieldNode } from './form-field-node';

type HandlePosition = 'top' | 'right' | 'bottom' | 'left';

interface IHandle {
  fromHandle?: HandlePosition;
  toHandle?: HandlePosition;
}

export interface INextUnary extends IHandle {
  type: NextTypeEnum.Unary;
  id?: string;
}

export interface INextBinary {
  type: NextTypeEnum.Binary;
  trueId?: string;
  falseId?: string;
  trueFromHandle?: HandlePosition;
  trueToHandle?: HandlePosition;
  falseFromHandle?: HandlePosition;
  falseToHandle?: HandlePosition;
}

export interface INextMultiOption extends IHandle {
  id: string;
  toId?: string;
  label?: string;
  bindId: string;
}

export interface INextMulti {
  type: NextTypeEnum.Multi;
  options: INextMultiOption[];
}

export type INext = INextUnary | INextBinary | INextMulti;

export interface IDefinitionBaseNode {
  nodeType: DefinitionNodeTypeEnum;
  id: string;
  bindId?: string;
  label?: string;
  position?: { x: number; y: number; width: number; height: number };
}

export interface IBaseNextNode extends IDefinitionBaseNode {
  next?: INextUnary;
}

export interface IBaseBooleanNode extends IDefinitionBaseNode {
  next?: INextBinary;
}

export interface IStartNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.Start;
}

export interface IEndNode extends IDefinitionBaseNode {
  nodeType: DefinitionNodeTypeEnum.End;
}

export interface INoteNode extends IDefinitionBaseNode {
  nodeType: DefinitionNodeTypeEnum.Note;
  contents?: string;
}

export interface IEmitDataNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.EmitData;
}

export interface ICustomFormNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.CustomForm;
}

// export interface IOptionSelectNode extends IBaseNextNode {
//   nodeType: DefinitionNodeTypeEnum.OptionSelect;
//   options: IOptionSelectNodeOption[];
//   min: number;
//   max: number | null;
// }

export interface IMultiOption {
  id: string;
  label: string;
  bindId?: string;
}

export interface IMultiOptionNode extends IBaseBooleanNode {
  nodeType: DefinitionNodeTypeEnum.MultiOption;
  options: IMultiOption[];
  min: number;
  max: number | null;
}

export interface IBranchNode extends IDefinitionBaseNode {
  nodeType: DefinitionNodeTypeEnum.Branch;
  next?: INextMulti;
}

export interface ITrueFalseNode extends IBaseBooleanNode {
  nodeType: DefinitionNodeTypeEnum.TrueFalse;
  // onFalse
  // onTrue
}

export interface IBaseAction {
  id: string;
  label: string;
  bindId?: string;
}

export interface IOrderAction extends IBaseAction {
  actionType: ActionEnum.Order;
}

export interface IPrescribeAction extends IBaseAction {
  actionType: ActionEnum.Prescribe;
}

export interface IDiagnoseAction extends IBaseAction {
  actionType: ActionEnum.Diagnose;
}

export type IAction = IOrderAction | IDiagnoseAction | IPrescribeAction;

export interface IActionNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.Action;
  actions: IAction[];
  min: number;
  max: number | null;
}

export interface INarrativeNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.Narrative;
  narrative: string;
}

export interface ISubFlowNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.SubFlow;
  subFlowId: string;
}

interface LocalTrueFalse extends ITrueFalseNode {
  logicType: LogicEnum.TrueFalseLeaf;
}

export type ITrueFalseLeaf = Omit<LocalTrueFalse, 'next' | 'position'>;

export interface IOr {
  logicType: LogicEnum.Or;
  children: ILogicLeaf[];
}

export interface IAnd {
  logicType: LogicEnum.And;
  children: ILogicLeaf[];
}

export type ILogic = IAnd | IOr;
export type ILogicLeaf = IAnd | IOr | ITrueFalseLeaf;

export interface ILogicTreeNode extends IBaseBooleanNode {
  nodeType: DefinitionNodeTypeEnum.LogicTree;
  logicTree?: ILogic;
  // onFalse
  // onTrue
}

export type IFlowDefinitionNextNode =
  | IStartNode
  | IEmitDataNode
  | IActionNode
  | ISubFlowNode
  | INarrativeNode
  | ICustomFormNode
  | IFormFieldNode;

export type IFlowDefinitionBooleanNode =
  | ITrueFalseNode
  | ILogicTreeNode
  | IMultiOptionNode;

export type IFlowDefinitionNode =
  | IFlowDefinitionNextNode
  | IFlowDefinitionBooleanNode
  | IBranchNode
  | INoteNode
  | IEndNode;
