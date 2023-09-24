import { BaseNode } from './abstract/base-node';
import { ImplementationNodeTypeEnum, NextTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import {
  IBranchNode,
  INextMulti,
  INextMultiOption,
} from '../flow-definition/flow-definition';
// interface IBranchChoiceNode extends IBaseNode {
//   nodeType: NodeTypeEnum.BranchChoice;
//   next?: INextMulti;
// }

export class BranchChoiceNode<
  C extends FlowContext = FlowContext
> extends BaseNode<C, IBranchNode> {
  nodeType = ImplementationNodeTypeEnum.BranchChoice;

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
