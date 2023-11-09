import { TernaryEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import { INextMultiOption } from '../flow-definition';

export type BranchOptionExecutor<C extends FlowContext> = (
  context: C
) => TernaryEnum;

export class BranchOptionExec<C extends FlowContext = FlowContext> {
  definition: INextMultiOption;

  private executor?: BranchOptionExecutor<C>;

  constructor(definition: INextMultiOption) {
    this.definition = definition;
  }

  setExecutor(executor: BranchOptionExecutor<C>) {
    this.executor = executor;
  }

  getExecutor(): BranchOptionExecutor<C> | null {
    return this.executor || null;
  }

  async evaluate(context: C): Promise<TernaryEnum> {
    if (this.executor) {
      return this.executor(context);
    }

    return TernaryEnum.UNKNOWN;
  }
}
