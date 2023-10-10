import { InputDataNode } from '../abstract/inputdata-node';
import { ImplementationNodeTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { NextNode } from '../abstract/next-node';
import { ITextFieldNode } from '../../flow-definition';

export class TextFieldNode<
  C extends FlowContext = FlowContext
> extends NextNode<C, ITextFieldNode> {
  nodeType = ImplementationNodeTypeEnum.TextField;

  // value?: string;

  async getValue(context: C): Promise<string | null> {
    return null;
  }

  isValid(): boolean {
    return true;
  }
}
