import { NextNode } from '../abstract/next-node';
// import { NodeTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { IFlowDefinitionNextNode } from '../../flow-definition/flow-definition';

export abstract class InputDataNode<
  C extends FlowContext,
  V,
  D extends IFlowDefinitionNextNode = IFlowDefinitionNextNode
> extends NextNode<C, D> {
  value?: V;

  getValue(): V | null {
    return this.value || null;
  }
}
