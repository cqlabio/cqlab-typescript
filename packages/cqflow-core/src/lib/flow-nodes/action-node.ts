import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';

export type ActionNodeExecutor<C> = (context: C) => void;

// interface IActionNode extends IBaseNextNode {
//   nodeType: NodeTypeEnum.Action;
// }

export class ActionNode<C extends FlowContext> extends NextNode<C> {
  // implements IActionNode
  nodeType = ImplementationNodeTypeEnum.Action;

  private executor?: ActionNodeExecutor<C>;

  setExecutor(executor: ActionNodeExecutor<C>) {
    this.executor = executor;
  }

  getExecutor(): ActionNodeExecutor<C> | null {
    return this.executor || null;
  }

  takeAction(context: C): void {
    if (this.executor) {
      return this.executor(context);
    }
    return;
  }
}
