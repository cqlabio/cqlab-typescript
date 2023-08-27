import { BaseNode } from './abstract/base-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';

export class EndNode<C extends FlowContext = FlowContext> extends BaseNode<C> {
  // implements IEndNode
  nodeType = ImplementationNodeTypeEnum.End;
  // nodeType: NodeTypeEnum.End = NodeTypeEnum.End;
}
