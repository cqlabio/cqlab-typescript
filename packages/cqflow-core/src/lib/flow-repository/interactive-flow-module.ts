import {
  InteractiveFlowContext,
  InteractiveFlowContextOptions,
} from '../flow-context/interactive-flow-context';
import { executeInteractiveFlow } from '../flow-executor/executor-interactive';
import { InteractiveFlowImplementation } from '../flow-implementation/interactive-flow-implementation';

export interface InteractiveModuleConfigOpts<I = any> {
  flowImplementation: InteractiveFlowImplementation<
    InteractiveFlowContext<I, any>
  >;
  flowContext: (
    opts: InteractiveFlowContextOptions<I>
  ) => InteractiveFlowContext;
  testData: I[];
}

export class InteractiveFlowModule {
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
