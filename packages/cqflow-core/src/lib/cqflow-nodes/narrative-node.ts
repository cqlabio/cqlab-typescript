import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../cqflow-context/cqflow-context';

// interface IEmitDataNode extends IBaseNextNode {
//   nodeType: NodeTypeEnum.ContextData;
//   dataItems: any[];
// }

// export type RegisterContextData<S, C> = (data: S, context: C) => void;

// export type AlsoRegisterContextData<S, C> = () => (register: RegisterContextData<S>, context: C) => void;

export class NarrativeNode<C extends FlowContext<any>> extends NextNode<C> {
  // implements IEmitDataNode

  nodeType = ImplementationNodeTypeEnum.Narrative;
}
