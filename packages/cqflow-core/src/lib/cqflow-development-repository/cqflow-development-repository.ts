import { FlowImplementation } from '../cqflow-implementation/flow-implementation';
import { FlowContext } from '../cqflow-context/cqflow-context';

type Newable<T> = new (...args: any[]) => T;

type InitFunction = (
  flowInstance: any,
  stateLoader: any
) => {
  flowImplementation: FlowImplementation<any>;
  context: FlowContext;
  testData: any[];
};

export interface CQFlowDevelopmentModule<C extends FlowContext> {
  bindId: string;
  flowKlass: Newable<FlowImplementation<C>>;
  contextKlass: Newable<C>;
  testCases: any[];
}

export class CQFlowDevelopmentRepository {
  cqflowModules: Record<string, CQFlowDevelopmentModule<any>> = {};

  tempThing: Record<string, InitFunction> = {};

  registerCQFlowModule<C extends FlowContext>(
    bindId: string,
    flowKlass: Newable<FlowImplementation<C>>,
    contextKlass: Newable<C>,
    testCases: any[]
  ) {
    this.cqflowModules[bindId] = {
      bindId: bindId,
      flowKlass,
      contextKlass,
      testCases,
    };
  }

  getModules(): CQFlowDevelopmentModule<any>[] {
    return Object.values(this.cqflowModules);
  }

  getModuleById(id: string): CQFlowDevelopmentModule<any> | null {
    return this.cqflowModules[id] || null;
  }

  registerCQFlowModuleNew(bindId: string, closure: InitFunction) {
    this.tempThing[bindId] = closure;
  }

  getModuleByIdAlso(id: string) {
    return this.tempThing[id] || null;
  }
}
