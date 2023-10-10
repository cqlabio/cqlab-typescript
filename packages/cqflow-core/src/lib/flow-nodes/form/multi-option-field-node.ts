import { NextNode } from '../abstract/next-node';
import { ImplementationNodeTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { IEmitDataNode, IMultiOptionFieldNode } from '../../flow-definition';

export class MultiOptionFieldNode<
  C extends FlowContext = FlowContext
> extends NextNode<C, IMultiOptionFieldNode> {
  nodeType = ImplementationNodeTypeEnum.MultiOptionField;

  constructor(node: IMultiOptionFieldNode) {
    super(node);
  }

  getOptions() {
    return this.getDefinition().field.options;
  }
}
