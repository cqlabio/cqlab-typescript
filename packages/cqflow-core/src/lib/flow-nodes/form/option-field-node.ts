import { NextNode } from '../abstract/next-node';
import { ImplementationNodeTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { IEmitDataNode, IOptionFieldNode } from '../../flow-definition';

export class OptionFieldNode<
  C extends FlowContext = FlowContext
> extends NextNode<C, IOptionFieldNode> {
  nodeType = ImplementationNodeTypeEnum.OptionField;

  constructor(node: IOptionFieldNode) {
    super(node);
  }

  getOptions() {
    return this.getDefinition().options;
  }
}
