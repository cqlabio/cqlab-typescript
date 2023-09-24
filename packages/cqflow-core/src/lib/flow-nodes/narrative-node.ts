import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import { INarrativeNode } from '../flow-definition/flow-definition';

// interface IEmitDataNode extends IBaseNextNode {
//   nodeType: NodeTypeEnum.ContextData;
//   dataItems: any[];
// }

// export type RegisterContextData<S, C> = (data: S, context: C) => void;

// export type AlsoRegisterContextData<S, C> = () => (register: RegisterContextData<S>, context: C) => void;

export class NarrativeNode<
  C extends FlowContext<any> = FlowContext<any>
> extends NextNode<C, INarrativeNode> {
  // implements IEmitDataNode

  nodeType = ImplementationNodeTypeEnum.Narrative;
}
