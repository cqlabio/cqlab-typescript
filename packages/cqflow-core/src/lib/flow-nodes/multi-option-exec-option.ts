import { TernaryEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import { IMultiOption, INextMultiOption } from '../flow-definition';

export type MultiOptionExecutor<C extends FlowContext> = (
  context: C
) => TernaryEnum;

export class MultiOptionExec<C extends FlowContext = FlowContext> {
  definition: IMultiOption;

  private executor?: MultiOptionExecutor<C>;

  constructor(definition: IMultiOption) {
    this.definition = definition;
  }

  setExecutor(executor: MultiOptionExecutor<C>) {
    this.executor = executor;
  }

  getExecutor(): MultiOptionExecutor<C> | null {
    return this.executor || null;
  }

  async evaluate(context: C): Promise<TernaryEnum> {
    if (this.executor) {
      return this.executor(context);
    }

    return TernaryEnum.UNKNOWN;
  }
}
