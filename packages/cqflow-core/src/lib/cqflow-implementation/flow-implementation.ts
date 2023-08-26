import {
  FlowNode,
  BaseNode,
  YesNoNode,
  ExecNode,
  EmitDataNode,
  ActionNode,
} from '../cqflow-nodes';
// import { instanceToPlain } from 'class-transformer';
import {
  FlowDefinitionTypeEnum,
  ImplementationNodeTypeEnum,
  DefinitionNodeTypeEnum,
} from '../enums';
import { FlowContext } from '../cqflow-context/cqflow-context';
import { InputDataNode } from '../cqflow-nodes/abstract/inputdata-node';
import {
  IEmitDataNode,
  ITrueFalseNode,
} from '../cqflow-definition/cqflow-definition';

type NodeBinding = {
  nodeType: ImplementationNodeTypeEnum;
};

export interface IFlowImplementation {
  id: string;
  type: FlowDefinitionTypeEnum;
  nodeBindings: Record<string, NodeBinding>;
}

export type Newable<T> = new (...args: any[]) => T;

export type RegisterNodeBinding<C extends FlowContext<any, any>> = (
  nodeId: string,
  klass: Newable<BaseNode<C>>
) => void;

export type RegisterContextExample<T> = (context: T) => void;

export interface IImplementation<C extends FlowContext<any, any>> {
  id?: string;

  nodes: Record<string, BaseNode<C>>;

  addNode(node: BaseNode<C>): void;

  getNodeById(nodeId: string): BaseNode<C> | null;

  getNodeDefinitions(): Record<string, FlowNode>;

  getImplementation(): IFlowImplementation;
}

export type RegisterTrueFalse<C extends FlowContext<any, any>> = (
  trueFalse: ITrueFalseNode
) => BaseNode<C>;

export type RegisterEmitData<C extends FlowContext<any, any>> = (
  emitData: IEmitDataNode
) => BaseNode<C>;

export interface NodeRegistrar<C extends FlowContext<any, any>> {
  [DefinitionNodeTypeEnum.TrueFalse]: Record<string, RegisterTrueFalse<C>>;
  [DefinitionNodeTypeEnum.EmitData]: Record<string, RegisterEmitData<C>>;
}

export abstract class FlowImplementation<C extends FlowContext<any, any>>
  implements IImplementation<C>
{
  private _id?: string;

  declare c: C;

  // boundKlasses: Record<string, Newable<BaseNode<C>>> = {};

  registrar: NodeRegistrar<C> = {
    [DefinitionNodeTypeEnum.TrueFalse]: {},
    [DefinitionNodeTypeEnum.EmitData]: {},
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
