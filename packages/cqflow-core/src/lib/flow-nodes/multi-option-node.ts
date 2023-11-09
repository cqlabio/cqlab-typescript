import { BooleanNode } from './abstract/boolean-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { BaseNode } from './abstract/base-node';
import { Logic } from './logic';
import { FlowContext } from '../flow-context/flow-context';
import { IMultiOption, IMultiOptionNode } from '../flow-definition';
import { MultiOptionExec } from './multi-option-exec-option';

// interface ILogicTreeNode extends IBaseBooleanNode {
//   nodeType: NodeTypeEnum.LogicTree;

//   logicTree?: ILogic | null;
// }
export type RegisterMultiOption<C extends FlowContext> = (
  multiOption: IMultiOption
) => MultiOptionExec<C>;

export class MultiOptionExecNode<
  C extends FlowContext = FlowContext
> extends BooleanNode<C, IMultiOptionNode> {
  nodeType = ImplementationNodeTypeEnum.MultiOptionExec;

  registrar: Record<string, RegisterMultiOption<C>> = {};

  getOptions() {
    return this.getDefinition().options;
  }

  registerBindings(): void {
    return;
  }

  registerMultiOption(optionId: string, fn: RegisterMultiOption<C>) {
    this.registrar[optionId] = fn;
  }
}
