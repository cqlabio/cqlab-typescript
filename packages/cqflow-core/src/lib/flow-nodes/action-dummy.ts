import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import { IActionNode, INarrativeNode } from '../flow-definition';

// interface IEmitDataNode extends IBaseNextNode {
//   nodeType: NodeTypeEnum.ContextData;
//   dataItems: any[];
// }

// export type RegisterContextData<S, C> = (data: S, context: C) => void;

// export type AlsoRegisterContextData<S, C> = () => (register: RegisterContextData<S>, context: C) => void;

export class ActionDummyNode<
  C extends FlowContext<any> = FlowContext<any>
> extends NextNode<C, IActionNode> {
  nodeType = ImplementationNodeTypeEnum.Action;

  getActions() {
    return this.definition.actions;
  }
}
