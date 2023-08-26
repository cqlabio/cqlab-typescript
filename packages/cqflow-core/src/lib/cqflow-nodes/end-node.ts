import { BaseNode } from './abstract/base-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../cqflow-context/cqflow-context';

// interface IEndNode extends IBaseNode {
//   nodeType: NodeTypeEnum.End;
// }

export class EndNode<C extends FlowContext> extends BaseNode<C> {
  // implements IEndNode
  nodeType = ImplementationNodeTypeEnum.End;
  // nodeType: NodeTypeEnum.End = NodeTypeEnum.End;
}
