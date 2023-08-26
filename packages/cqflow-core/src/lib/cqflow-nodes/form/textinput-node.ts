import { InputDataNode } from '../abstract/inputdata-node';
import { ImplementationNodeTypeEnum } from '../../enums';
import { FlowContext } from '../../cqflow-context/cqflow-context';

export class TextInputNode<C extends FlowContext> extends InputDataNode<
  C,
  string
> {
  nodeType = ImplementationNodeTypeEnum.TextInput;

  isValid(): boolean {
    return true;
  }
}
