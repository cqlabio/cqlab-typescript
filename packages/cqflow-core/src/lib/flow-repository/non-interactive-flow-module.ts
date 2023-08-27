import { FlowContext, FlowContextOpts } from '../flow-context/flow-context';
import { executeNonInteractiveFlow } from '../flow-executor/executor-non-interactive';
import { NonInteractiveFlowImplementation } from '../flow-implementation/non-interactive-flow-implementation';

export interface NonInteractiveModuleConfigOpts<I = any> {
  flowImplementation: NonInteractiveFlowImplementation<FlowContext<I, any>>;
  flowContext: (opts: FlowContextOpts<I>) => FlowContext;
  testData: I[];
}

export class NonInteractiveFlowModule {
  public configOpts: NonInteractiveModuleConfigOpts;

  constructor(config: NonInteractiveModuleConfigOpts) {
    this.configOpts = config;
  }

  execute(contextOpts: FlowContextOpts<any>) {
    return executeNonInteractiveFlow(
      this.configOpts.flowImplementation,
      this.configOpts.flowContext(contextOpts)
    );
  }
}
