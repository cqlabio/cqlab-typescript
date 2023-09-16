export * from './abstract/base-node';
export * from './abstract/boolean-node';
export * from './abstract/next-node';

export * from './logic/index';

export * from './start-node';
export * from './exec-node';
export * from './end-node';
export * from './yesno-node';
export * from './emitdata-node';
export * from './action-node';
export * from './logictree-node';
export * from './subflow-node';
export * from './branchchoice-node';
export * from './message-node';
export * from './narrative-node';
export * from './option-select-node';
export * from './form/customdata-inputnode';

export * from './form/textinput-node';

export * from './utils';

import { StartNode } from './start-node';
import { ExecNode } from './exec-node';
import { EndNode } from './end-node';
import { YesNoNode } from './yesno-node';
import { EmitDataNode } from './emitdata-node';
import { ActionNode } from './action-node';
import { LogicTreeNode } from './logictree-node';
import { SubFlowNode } from './subflow-node';
import { BranchChoiceNode } from './branchchoice-node';
import { MessageNode } from './message-node';
import { NarrativeNode } from './narrative-node';
import { CustomDataInputNode } from './form/customdata-inputnode';
// import { IBaseBooleanNode } from './abstract/boolean-node';
// import { IBaseNextNode } from './abstract/next-node';

export type FlowNode =
  | StartNode<any>
  | ExecNode<any>
  | EndNode<any>
  | YesNoNode<any>
  | EmitDataNode<any, any>
  | ActionNode<any>
  | LogicTreeNode<any>
  | SubFlowNode<any>
  | BranchChoiceNode<any>
  | MessageNode<any>
  | NarrativeNode<any>
  | CustomDataInputNode<any, any>;

// export type INextNode =
//   | IStartNode
//   | IEmitDataNode
//   | IActionNode
//   | ISubFlowNode
//   | IMessageNode;

// export type IBooleanNode = IExecNode | IYesNoNode | ILogicTreeNode;

// export type IFlowDefinitionNode = INextNode | IBooleanNode | IEndNode | IBranchChoiceNode;
