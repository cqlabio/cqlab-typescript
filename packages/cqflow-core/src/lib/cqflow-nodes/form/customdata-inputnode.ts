import { InputDataNode } from '../abstract/inputdata-node';
import { ImplementationNodeTypeEnum } from '../../enums';
import { FlowContext } from '../../cqflow-context/cqflow-context';
import { JSONSchema7 } from 'json-schema';

export abstract class CustomDataInputNode<
  C extends FlowContext = FlowContext,
  D = any
> extends InputDataNode<C, D> {
  nodeType = ImplementationNodeTypeEnum.TextInput;

  abstract getValueJsonSchema(): JSONSchema7;

  isValid(): boolean {
    return true;
  }

  // onSubmitData(data: D, context: C): void {
  //   return undefined;
  // }
}
