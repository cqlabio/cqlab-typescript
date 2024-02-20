import { IFlowDefinition, IFlowDefinitionNode } from '../flow-definition';
import { IFlowStep } from '../flow-steps';

export abstract class LazyFlowDefinitionRetriever {
  abstract loadFlowDefinitionById(id: string): Promise<IFlowDefinition> 
}

export interface ContextStackItem<S> {
  nodeId: string;
  data: S;
}

export interface FlowContextOpts<I> {
  initialData: I;
  flowDefinitionId: string;
  flowDefinitionRetriever: LazyFlowDefinitionRetriever;
}

export abstract class FlowContext<I = any, S = any> {
  flowId?: string;

  private _initialData: I;
  private _flowDefinitionId: string;
  private _flowDefinitionRetriever: LazyFlowDefinitionRetriever;
  private _contextDataStack: ContextStackItem<S>[] = [];
  private _steps: Map<string, IFlowStep> = new Map();

  constructor(opts: FlowContextOpts<I>) {
    this._initialData = opts.initialData;
    this._flowDefinitionId = opts.flowDefinitionId;
    this._flowDefinitionRetriever = opts.flowDefinitionRetriever;
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

  // setFlowDefinition(flowDefinition: IFlowDefinition) {
  //   this._flowDefinition = flowDefinition;
  // }

  async getFlowDefinition(): Promise<IFlowDefinition> {
    return this._flowDefinitionRetriever.loadFlowDefinitionById(this._flowDefinitionId);
  }

  getFlowDefinitionRetriever() {
    return this._flowDefinitionRetriever;
  }

  // TODO: can add a bindId index here so this happens at most once
  async getFlowDefinitionNodeByBindId(bindId: string): Promise<IFlowDefinitionNode | null> {
    const flowDefinition = await this.getFlowDefinition();
    const nodes = Object.values(flowDefinition.nodes || {});
    const found = nodes.find((node) => node.bindId === bindId);
    return found || null;
  }

  clearSteps() {
    this._steps.clear();
  }

  addFlowStep = (step: IFlowStep) => {
    if (step.stepId in this._steps) {
      throw new Error(`Step ${step.stepId} already exists`);
    }
    this._steps.set(step.stepId, step);
  };

  async getFlowStepByBindId(bindId: string):Promise<IFlowStep | null> {
    const flowDefNode = await this.getFlowDefinitionNodeByBindId(bindId);
    if (!flowDefNode) {
      return null;
    }
    return this._steps.get(flowDefNode.id) || null;
  }

  // Should be in insertion order
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  getFlowSteps(): IFlowStep[] {
    return Array.from(this._steps.values());
  }
}
