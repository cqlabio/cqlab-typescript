import {
  IFlowDefintion,
  IFlowDefinitionNode,
} from '../flow-definition/flow-definition';

export interface ContextStackItem<S> {
  nodeId: string;
  data: S;
}

export interface FlowContextOpts<I> {
  initialData: I;
  flowDefinition: IFlowDefintion;
}

export abstract class FlowContext<I = any, S = any> {
  flowId?: string;

  private _initialData: I;
  private _flowDefinition: IFlowDefintion;
  private _contextDataStack: ContextStackItem<S>[] = [];

  constructor(opts: FlowContextOpts<I>) {
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

  // TODO: can add a bindId index here so this happens at most once
  getFlowDefinitionNodeByBindId(bindId: string): IFlowDefinitionNode | null {
    const nodes = Object.values(this._flowDefinition.nodes || {});
    const found = nodes.find((node) => node.bindId === bindId);
    return found || null;
  }
}
