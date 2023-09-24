import { BaseNode } from './abstract/base-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import { IEndNode } from '../flow-definition/flow-definition';

export class EndNode<C extends FlowContext = FlowContext> extends BaseNode<
  C,
  IEndNode
> {
  // implements IEndNode
  nodeType = ImplementationNodeTypeEnum.End;
  // nodeType: NodeTypeEnum.End = NodeTypeEnum.End;
}
