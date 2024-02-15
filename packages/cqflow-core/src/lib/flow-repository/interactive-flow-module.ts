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
  private configOpts: InteractiveModuleConfigOpts;

  constructor(config: InteractiveModuleConfigOpts) {
    this.configOpts = config;
  }

  getFlowImplementation() {
    return this.configOpts.flowImplementation;
  }

  getTestData() {
    return this.configOpts.testData;
  }

  createContext = (opts: InteractiveFlowContextOptions<any>) => {
    return this.configOpts.flowContext(opts);
  };

  execute(contextOpts: InteractiveFlowContextOptions<any, any>) {
    return executeInteractiveFlow(
      this.configOpts.flowImplementation,
      this.configOpts.flowContext(contextOpts)
    );
  }
}
