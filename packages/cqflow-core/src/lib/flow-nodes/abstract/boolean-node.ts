import { BaseNode } from './base-node';
import { INextBinary } from '../../flow-definition/next';
import { NextTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { IFlowDefinitionBooleanNode } from '../../flow-definition/flow-definition';

// export interface IBaseBooleanNode extends IBaseNode {
//   next?: INextBinary;
// }

export abstract class BooleanNode<
  C extends FlowContext,
  D extends IFlowDefinitionBooleanNode
> extends BaseNode<C, D> {
  next: INextBinary = {
    type: NextTypeEnum.Binary,
  };

  constructor(node: D) {
    super(node);
    this.next = node?.next || this.next;
  }

  setOnTrueNode(node: BaseNode<C, D>) {
    this.next.trueId = node.getDefinitionId() || undefined;
  }

  setOnFalseNode(node: BaseNode<C, D>) {
    this.next.falseId = node.getDefinitionId() || undefined;
  }

  getOnTrueId(): string | null {
    return this.next?.trueId || null;
  }

  getOnFalseId(): string | null {
    return this.next?.falseId || null;
  }
}
