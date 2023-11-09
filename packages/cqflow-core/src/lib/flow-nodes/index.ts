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
export * from './branch-choice-node';
export * from './message-node';
export * from './branch-exec-node';
export * from './branch-exec-option';
export * from './narrative-node';
export * from './form/custom-form-node';
export * from './form/text-field-node';
export * from './form/number-field-node';
export * from './form/multi-option-field-node';

export * from './utils';

import { StartNode } from './start-node';
import { ExecNode } from './exec-node';
import { EndNode } from './end-node';
import { YesNoNode } from './yesno-node';
import { EmitDataNode } from './emitdata-node';
import { ActionNode } from './action-node';
import { LogicTreeNode } from './logictree-node';
import { SubFlowNode } from './subflow-node';
import { BranchChoiceNode } from './branch-choice-node';
import { BranchExecNode } from './branch-exec-node';
import { MessageNode } from './message-node';
import { NarrativeNode } from './narrative-node';
import { CustomFormNode } from './form/custom-form-node';
import { MultiOptionExec } from './multi-option-exec-option';
// import { IBaseBooleanNode } from './abstract/boolean-node';
// import { IBaseNextNode } from './abstract/next-node';

export type FlowNode =
  | StartNode<any>
  | ExecNode<any>
  | EndNode<any>
  | YesNoNode<any>
  | MultiOptionExec<any>
  | EmitDataNode<any, any>
  | ActionNode<any>
  | LogicTreeNode<any>
  | SubFlowNode<any>
  | BranchChoiceNode<any>
  | BranchExecNode<any>
  | MessageNode<any>
  | NarrativeNode<any>
  | CustomFormNode<any, any>;

// export type INextNode =
//   | IStartNode
//   | IEmitDataNode
//   | IActionNode
//   | ISubFlowNode
//   | IMessageNode;

// export type IBooleanNode = IExecNode | IYesNoNode | ILogicTreeNode;

// export type IFlowDefinitionNode = INextNode | IBooleanNode | IEndNode | IBranchChoiceNode;
