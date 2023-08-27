import { BaseNode } from './base-node';
import { INextUnary } from '../../flow-definition/next';
import { NextTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { IFlowDefinitionNextNode } from '../../flow-definition/flow-definition';

// export interface IBaseNextNode extends IBaseNode {
//   next?: INextUnary;
// }

export abstract class NextNode<C extends FlowContext> extends BaseNode<C> {
  next: INextUnary = {
    type: NextTypeEnum.Unary,
  };

  constructor(node?: IFlowDefinitionNextNode) {
    super(node);
    this.next = node?.next || this.next;
  }

  setNextNode(node: BaseNode<C>) {
    this.next.id = node.getDefinitionId() || undefined;
  }

  getNextNodeId(): string | null {
    return this.next?.id || null;
  }
}
