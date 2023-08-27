import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import {
  IFlowDefinitionNode,
  ISubFlowNode,
} from '../flow-definition/flow-definition';

// interface ISubFlowNode extends IBaseNextNode {
//   nodeType: NodeTypeEnum.SubFlow;
//   subFlowId?: string;
// }

export class SubFlowNode<C extends FlowContext> extends NextNode<C> {
  nodeType = ImplementationNodeTypeEnum.SubFlow;
  // implements ISubFlowNode
  // nodeType: NodeTypeEnum.SubFlow = NodeTypeEnum.SubFlow;

  // subFlowId?: string;

  getSubFlowId(): string | null {
    const def = this.getDefinition() as ISubFlowNode;
    return def?.subFlowId || null;
  }

  getSubFlowContext(context: C): FlowContext | null {
    return null;
  }
}
