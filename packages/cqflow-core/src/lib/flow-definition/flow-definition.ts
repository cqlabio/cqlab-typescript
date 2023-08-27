// import { IFlowDefinitionNode } from '../flow-nodes';
import {
  // FlowDefinitionTypeEnum,
  NextTypeEnum,
  DefinitionNodeTypeEnum,
  LogicEnum,
} from '../enums';

// export enum INewDefinitionNodeTypeEnum {
//   TrueFalse = 'TrueFalse',
// }

export interface INextUnary {
  type: NextTypeEnum.Unary;
  id?: string;
}

export interface INextBinary {
  type: NextTypeEnum.Binary;
  trueId?: string;
  falseId?: string;
}

export interface INextMultiOption {
  label?: string;
  id?: string;
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
  skipRender?: boolean;
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

export interface IEmitDataNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.EmitData;
}

export interface IInputDataNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.InputData;
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

export interface IActionNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.Action;
  // onFalse
  // onTrue
}

export interface INarrativeNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.Narrative;
  narrative: string;
  // onFalse
  // onTrue
}

export interface ISubFlowNode extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.SubFlow;
  subFlowId: string;
  // onFalse
  // onTrue
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
  | IInputDataNode
  | IActionNode
  | ISubFlowNode
  | INarrativeNode;

export type IFlowDefinitionBooleanNode = ITrueFalseNode | ILogicTreeNode;

export type IFlowDefinitionNode =
  | IFlowDefinitionNextNode
  | IFlowDefinitionBooleanNode
  | IBranchNode
  | IEndNode;

export interface IFlowDefintion {
  id: string;
  bindId?: string;
  // type: FlowDefinitionTypeEnum;
  nodes: Record<string, IFlowDefinitionNode>;
  version: string;
}
