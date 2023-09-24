import { BaseNode } from './base-node';
import { NextTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { IFlowDefinitionNode } from '../../flow-definition/flow-definition';
import {
  IFlowDefinitionNextNode,
  INextUnary,
} from '../../flow-definition/flow-definition';

// export interface IBaseNextNode extends IBaseNode {
//   next?: INextUnary;
// }

export abstract class NextNode<
  C extends FlowContext,
  D extends IFlowDefinitionNextNode = IFlowDefinitionNextNode
> extends BaseNode<C, D> {
  next: INextUnary = {
    type: NextTypeEnum.Unary,
  };

  constructor(node: D) {
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
