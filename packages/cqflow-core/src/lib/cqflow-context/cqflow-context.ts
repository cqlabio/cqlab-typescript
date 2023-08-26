import {
  IFlowDefintion,
  IFlowDefinitionNode,
} from '../cqflow-definition/cqflow-definition';

export interface ContextStackItem<S> {
  nodeId: string;
  data: S;
}

export interface ContextInit<I> {
  initialData: I;
  flowDefinition: IFlowDefintion;
}

export abstract class FlowContext<I, S> {
  flowId?: string;

  private _initialData: I;
  private _contextDataStack: ContextStackItem<S>[] = [];
  private _flowDefinition: IFlowDefintion;

  constructor(opts: ContextInit<I>) {
    this._initialData = opts.initialData;
    this._flowDefinition = opts.flowDefinition;
  }

  getInitialData(): I {
    return this._initialData;
  }

  getContextDataStack(): ContextStackItem<S>[] {
    return this._contextDataStack;
  }

  addToContextDataStack(nodeId: string, contextData: S) {
    this._contextDataStack.push({
      nodeId: nodeId,
      data: contextData,
    });
  }

  // setFlowDefinition(flowDefinition: IFlowDefintion) {
  //   this._flowDefinition = flowDefinition;
  // }

  getFlowDefinition(): IFlowDefintion {
    return this._flowDefinition;
  }

  getFlowDefinitionNodeByBindId(bindId: string): IFlowDefinitionNode | null {
    if (!this._flowDefinition) {
      return null;
    }

    const nodes = Object.values(this._flowDefinition.nodes || {});
    const found = nodes.find((node) => node.bindId === bindId);
    return found || null;
  }
}
