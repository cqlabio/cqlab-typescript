import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import {
  IEmitDataNode,
  IOptionSelecNode,
} from '../flow-definition/flow-definition';

export class OptionSelectNode<
  C extends FlowContext = FlowContext
> extends NextNode<C> {
  nodeType = ImplementationNodeTypeEnum.OptionSelect;

  constructor(node: IOptionSelecNode) {
    super(node);
  }
}
