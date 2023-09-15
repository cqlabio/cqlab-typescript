import { FlowDefinitionTypeEnum } from '../enums';
import { FlowImplementation } from '../flow-implementation/flow-implementation';
import { FlowContext } from '../flow-context/flow-context';
import {
  InteractiveFlowContext,
  InteractiveFlowContextOptions,
} from '../flow-context/interactive-flow-context';
import { InteractiveFlowImplementation } from '../flow-implementation/interactive-flow-implementation';
import { NonInteractiveFlowImplementation } from '../flow-implementation/non-interactive-flow-implementation';
import {
  InteractiveFlowModule,
  InteractiveModuleConfigOpts,
} from './interactive-flow-module';

import {
  NonInteractiveFlowModule,
  NonInteractiveModuleConfigOpts,
} from './non-interactive-flow-module';

type Newable<T> = new (...args: any[]) => T;

type InitFunction = (
  flowInstance: any,
  stateLoader: any
) => {
  flowImplementation: FlowImplementation<any>;
  context: FlowContext;
  testData: any[];
};

export interface BaseFlowModule {
  moduleType: FlowDefinitionTypeEnum;
  bindId: string;
  flowImplementation: FlowImplementation;
  testCases: any[];
}

// export interface NonInteractiveFlowModule extends BaseFlowModule {
//   mouduleType: FlowDefinitionTypeEnum.NonInteractive;
//   bindId: string;
//   flowImplementation: NonInteractiveFlowImplementation;
//   flowContext: FlowContext;
//   testCases: any[];
// }

// export interface InteractiveFlowModule extends BaseFlowModule {
//   mouduleType: FlowDefinitionTypeEnum.Interactive;
//   bindId: string;
//   flowImplementation: InteractiveFlowImplementation;
//   flowContext: InteractiveFlowContext;
//   testCases: any[];
// }

export type FlowModule = NonInteractiveFlowModule | InteractiveFlowModule;

export class FlowRepository {
  private _interactiveFlowConfigs: Record<string, InteractiveFlowModule> = {};

  private _nonInteractiveFlowConfigs: Record<string, NonInteractiveFlowModule> =
    {};

  registerInteractiveModule<I = any>(
    id: string,
    register: InteractiveModuleConfigOpts<I>
  ) {
    this._interactiveFlowConfigs[id] = new InteractiveFlowModule(register);
  }

  registerNonInteractiveModule<I = any>(
    id: string,
    register: NonInteractiveModuleConfigOpts<I>
  ) {
    this._nonInteractiveFlowConfigs[id] = new NonInteractiveFlowModule(
      register
    );
  }

  getInteractiveModule(id: string): InteractiveFlowModule | null {
    return this._interactiveFlowConfigs[id];
  }

  getNonInteractiveModule(id: string): NonInteractiveFlowModule | null {
    return this._nonInteractiveFlowConfigs[id];
  }
}
