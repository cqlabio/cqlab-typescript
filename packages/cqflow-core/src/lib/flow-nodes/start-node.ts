import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import { IStartNode } from '../flow-definition';
// interface IStartNode extends IBaseNextNode {
//   nodeType: NodeTypeEnum.Start;
// }

export class StartNode<C extends FlowContext = FlowContext> extends NextNode<
  C,
  IStartNode
> {
  nodeType = ImplementationNodeTypeEnum.Start;
  // implements IStartNode
}
