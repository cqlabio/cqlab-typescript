import { BaseNode } from './abstract/base-node';
import { ImplementationNodeTypeEnum, NextTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import { IBranchNode, INextMulti, INextMultiOption } from '../flow-definition';

export abstract class BaseBranchChoiceNode<
  C extends FlowContext = FlowContext
> extends BaseNode<C, IBranchNode> {
  next: INextMulti = {
    type: NextTypeEnum.Multi,
    options: [],
  };

  constructor(node: IBranchNode) {
    super(node);
    this.next = node?.next || this.next;
  }

  addOption(option: INextMultiOption) {
    this.next.options.push(option);
  }

  getOptions(): INextMultiOption[] {
    return this.next.options;
  }
}

export class BranchChoiceNode<
  C extends FlowContext = FlowContext
> extends BaseBranchChoiceNode<C> {
  nodeType = ImplementationNodeTypeEnum.BranchChoice;
}
