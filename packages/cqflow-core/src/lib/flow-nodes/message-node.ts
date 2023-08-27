import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';

// interface IMessageNode extends IBaseNextNode {
//   nodeType: NodeTypeEnum.Message;
// }

export class MessageNode<C extends FlowContext> extends NextNode<C> {
  nodeType = ImplementationNodeTypeEnum.Message;

  // implements IMessageNode
  // nodeType: NodeTypeEnum.Message = NodeTypeEnum.Message;
}
