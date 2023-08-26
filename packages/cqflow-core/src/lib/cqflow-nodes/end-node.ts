import { BaseNode } from './abstract/base-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../cqflow-context/cqflow-context';

export class EndNode<C extends FlowContext = FlowContext> extends BaseNode<C> {
  // implements IEndNode
  nodeType = ImplementationNodeTypeEnum.End;
  // nodeType: NodeTypeEnum.End = NodeTypeEnum.End;
}
