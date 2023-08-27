import { BaseNode } from './abstract/base-node';
import { ImplementationNodeTypeEnum, NextTypeEnum } from '../enums';
import { INextMulti, INextMultiOption } from '../flow-definition/next';
import { FlowContext } from '../flow-context/flow-context';
import { IBranchNode } from '../flow-definition/flow-definition';
import { ExecNode } from './exec-node';

// interface IBranchChoiceNode extends IBaseNode {
//   nodeType: NodeTypeEnum.BranchChoice;
//   next?: INextMulti;
// }

export type RegisterNodeBinding<C extends FlowContext> = (
  nodeId: string,
  klass: Newable<ExecNode<C>>
) => void;

export type Newable<T> = new (...args: any[]) => T;

export class BranchExecNode<C extends FlowContext> extends BaseNode<C> {
  boundKlasses: Record<string, Newable<ExecNode<C>>> = {};

  nodeType = ImplementationNodeTypeEnum.BranchChoice;

  next: INextMulti = {
    type: NextTypeEnum.Multi,
    options: [],
  };

  constructor(node?: IBranchNode) {
    super(node);
    this.next = node?.next || this.next;
    this.registerNodeBindings(this.registerNodeBinding);
  }

  addOption(option: INextMultiOption) {
    this.next.options.push(option);
  }

  getOptions(): INextMultiOption[] {
    return this.next.options;
  }

  registerNodeBinding: RegisterNodeBinding<C> = (nodeId, klass) => {
    this.boundKlasses[nodeId] = klass;
  };

  registerNodeBindings(register: RegisterNodeBinding<C>): void {
    return;
  }
}
