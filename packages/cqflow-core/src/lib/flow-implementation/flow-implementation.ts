import {
  FlowNode,
  BaseNode,
  YesNoNode,
  ExecNode,
  EmitDataNode,
  ActionNode,
} from '../flow-nodes';
// import { instanceToPlain } from 'class-transformer';
import {
  FlowDefinitionTypeEnum,
  ImplementationNodeTypeEnum,
  DefinitionNodeTypeEnum,
} from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import {
  IEmitDataNode,
  IInputDataNode,
  ITrueFalseNode,
} from '../flow-definition/flow-definition';

type NodeBinding = {
  nodeType: ImplementationNodeTypeEnum;
};

export interface IFlowImplementation {
  id: string;
  type: FlowDefinitionTypeEnum;
  nodeBindings: Record<string, NodeBinding>;
}

export type Newable<T> = new (...args: any[]) => T;

export type RegisterNodeBinding<C extends FlowContext> = (
  nodeId: string,
  klass: Newable<BaseNode<C>>
) => void;

export type RegisterContextExample<T> = (context: T) => void;

export interface IImplementation<C extends FlowContext> {
  id?: string;

  nodes: Record<string, BaseNode<C>>;

  addNode(node: BaseNode<C>): void;

  getNodeById(nodeId: string): BaseNode<C> | null;

  getNodeDefinitions(): Record<string, FlowNode>;

  getImplementation(): IFlowImplementation;
}

export type RegisterTrueFalse<C extends FlowContext> = (
  trueFalse: ITrueFalseNode
) => BaseNode<C>;

export type RegisterEmitData<C extends FlowContext> = (
  emitData: IEmitDataNode
) => BaseNode<C>;

export type RegisterInputData<C extends FlowContext> = (
  emitData: IInputDataNode
) => BaseNode<C>;

export interface NodeRegistrar<C extends FlowContext> {
  [DefinitionNodeTypeEnum.TrueFalse]: Record<string, RegisterTrueFalse<C>>;
  [DefinitionNodeTypeEnum.EmitData]: Record<string, RegisterEmitData<C>>;
  [DefinitionNodeTypeEnum.InputData]: Record<string, RegisterInputData<C>>;
}

export abstract class FlowImplementation<C extends FlowContext = FlowContext>
  implements IImplementation<C>
{
  private _id?: string;

  declare c: C;

  // boundKlasses: Record<string, Newable<BaseNode<C>>> = {};

  registrar: NodeRegistrar<C> = {
    [DefinitionNodeTypeEnum.TrueFalse]: {},
    [DefinitionNodeTypeEnum.EmitData]: {},
    [DefinitionNodeTypeEnum.InputData]: {},
  };

  private _boundIds = new Set<string>();

  nodes: Record<string, BaseNode<C>> = {};

  constructor() {
    // this.registerNodeBindings(this.registerNodeBinding);
  }

  protected getId(): string | undefined {
    return this._id;
  }

  get id(): string | undefined {
    if (this.getId && this.getId()) {
      return this.getId();
    }
    return this._id;
  }

  set id(id: string | undefined) {
    this._id = id;
  }

  abstract getImplementationType(): FlowDefinitionTypeEnum;

  getRegistrar(): NodeRegistrar<C> {
    return this.registrar;
  }

  addNode(node: BaseNode<C>): void {
    const id = node.getDefinitionId();
    if (id) {
      this.nodes[id] = node;
    }
  }

  getNodeById(nodeId: string) {
    return this.nodes[nodeId];
  }

  // registerNodeBinding: RegisterNodeBinding<C> = (nodeId, klass) => {
  //   this.boundKlasses[nodeId] = klass;
  // };

  // registerNodeBindings(register: RegisterNodeBinding<C>): void {
  //   return;
  // }

  getNodeDefinitions(): Record<string, FlowNode> {
    return {}; //instanceToPlain(this.nodes);
  }

  // Record<string, RegisterNode<C>> = {};

  private _checkId(nodeId: string) {
    if (this._boundIds.has(nodeId)) {
      throw new Error(
        `Id should not be registered with implementation more than once: ${nodeId}`
      );
    }
    this._boundIds.add(nodeId);
  }

  registerTrueFalse(nodeId: string, fn: RegisterTrueFalse<C>) {
    this._checkId(nodeId);
    this.registrar[DefinitionNodeTypeEnum.TrueFalse][nodeId] = fn;
  }

  registerEmitData(nodeId: string, fn: RegisterEmitData<C>) {
    this._checkId(nodeId);
    this.registrar[DefinitionNodeTypeEnum.EmitData][nodeId] = fn;
  }

  registerInputData(nodeId: string, fn: RegisterInputData<C>) {
    this._checkId(nodeId);
    this.registrar[DefinitionNodeTypeEnum.InputData][nodeId] = fn;
  }

  getImplementation(): IFlowImplementation {
    return {
      id: this.id as string,
      type: this.getImplementationType(),
      nodeBindings: {},

      // Object.keys(this.boundKlasses).reduce((acc, cur) => {
      //   const boundKlass = this.boundKlasses[cur];
      //   const node = new boundKlass();

      //   acc[cur] = {
      //     nodeType: node.nodeType,
      //   };

      //   return acc;
      // }, {} as Record<string, NodeBinding>),
    };
  }
}
