import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../cqflow-context/cqflow-context';
import {
  IFlowDefinitionNode,
  ISubFlowNode,
} from '../cqflow-definition/cqflow-definition';

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

  getSubFlowContext(context: C): FlowContext<any, any> | null {
    return null;
  }
}
