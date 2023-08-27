import {
  InteractiveFlowContext,
  InteractiveFlowContextOptions,
} from '../cqflow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../cqflow-executor/executor-interactive';
import { InteractiveFlowImplementation } from '../cqflow-implementation/interactive-flow-implementation';

export interface InteractiveModuleConfigOpts<I = any> {
  flowImplementation: InteractiveFlowImplementation<
    InteractiveFlowContext<I, any>
  >;
  flowContext: (
    opts: InteractiveFlowContextOptions<I>
  ) => InteractiveFlowContext;
  testData: I[];
}

export class InteractiveModuleConfig {
  public configOpts: InteractiveModuleConfigOpts;

  constructor(config: InteractiveModuleConfigOpts) {
    this.configOpts = config;
  }

  execute(contextOpts: InteractiveFlowContextOptions<any>) {
    return executeInteractiveFlow(
      this.configOpts.flowImplementation,
      this.configOpts.flowContext(contextOpts)
    );
  }
}
