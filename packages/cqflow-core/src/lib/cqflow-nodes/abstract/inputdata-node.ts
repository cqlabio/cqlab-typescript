import { NextNode } from '../abstract/next-node';
// import { NodeTypeEnum } from '../../enums';
import { FlowContext } from '../../cqflow-context/cqflow-context';

export abstract class InputDataNode<
  C extends FlowContext,
  D
> extends NextNode<C> {
  value?: D;

  getValue(): D | null {
    return this.value || null;
  }
}
