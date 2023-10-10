import { InputDataNode } from '../abstract/inputdata-node';
import { ImplementationNodeTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { NextNode } from '../abstract/next-node';
import { INumberFieldNode } from '../../flow-definition';

export class NumberFieldNode<
  C extends FlowContext = FlowContext
> extends NextNode<C, INumberFieldNode> {
  nodeType = ImplementationNodeTypeEnum.NumberField;

  async getValue(context: C): Promise<number | null> {
    return null;
  }

  isValid(): boolean {
    return true;
  }
}
