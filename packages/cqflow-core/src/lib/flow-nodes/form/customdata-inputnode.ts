import { InputDataNode } from '../abstract/inputdata-node';
import { ImplementationNodeTypeEnum } from '../../enums';
import { FlowContext } from '../../flow-context/flow-context';
import { JSONSchema7 } from 'json-schema';
import { IInputDataNode } from '../../flow-definition/flow-definition';

export abstract class CustomDataInputNode<
  C extends FlowContext = FlowContext,
  D = any
> extends InputDataNode<C, D, IInputDataNode> {
  nodeType = ImplementationNodeTypeEnum.TextInput;

  abstract getValueJsonSchema(): JSONSchema7;

  isValid(): boolean {
    return true;
  }

  // onSubmitData(data: D, context: C): void {
  //   return undefined;
  // }
}
