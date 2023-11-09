import { FlowContext } from '../flow-context/flow-context';
import { IBranchNode, INextMultiOption } from '../flow-definition';
import { BranchOptionExec } from './branch-exec-option';
import { BaseBranchChoiceNode } from './branch-choice-node';
import { ImplementationNodeTypeEnum } from '../enums';

export type RegisterBranchOption<C extends FlowContext> = (
  multiOption: INextMultiOption
) => BranchOptionExec<C>;

export class BranchExecNode<
  C extends FlowContext = FlowContext
> extends BaseBranchChoiceNode<C> {
  nodeType = ImplementationNodeTypeEnum.BranchExec;

  registrar: Record<string, RegisterBranchOption<C>> = {};

  constructor(node: IBranchNode) {
    super(node);
    this.registerBindings();
  }

  registerBindings(): void {
    return;
  }

  registerBranchOption(optionId: string, fn: RegisterBranchOption<C>) {
    this.registrar[optionId] = fn;
  }

  getBranchOptionExec(optionId: string): BranchOptionExec<C> | null {
    if (!this.registrar[optionId]) {
      return null;
    }
    const foundOption = this.getOptions().find(
      (option) => option.id === optionId
    );
    if (!foundOption) {
      return null;
    }

    return this.registrar[optionId](foundOption);
  }
}
