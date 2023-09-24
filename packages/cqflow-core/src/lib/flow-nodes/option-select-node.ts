import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import {
  IEmitDataNode,
  IOptionSelectNode,
} from '../flow-definition/flow-definition';

export class OptionSelectNode<
  C extends FlowContext = FlowContext
> extends NextNode<C, IOptionSelectNode> {
  nodeType = ImplementationNodeTypeEnum.OptionSelect;

  constructor(node: IOptionSelectNode) {
    super(node);
  }

  getOptions() {
    return this.getDefinition().options;
  }
}
