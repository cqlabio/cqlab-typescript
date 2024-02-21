import { create } from 'zustand';
import {
  IFlowDefinitionNode,
  IFlowDefinition,
  IFlowImplementation,
  InteractiveFlowState,
} from '@cqlab/cqflow-core';
import { setSelectedServer, getSelectedServer } from '../data/local-storage';

export const DEFAULT_FLOW_DEF_SERVER = 'http://localhost:3333/api';

interface UpdateOp {
  op: 'update';
  node: IFlowDefinitionNode;
}

interface DeleteOp {
  op: 'delete';
  nodeId: string;
}

export type NodeOp = UpdateOp | DeleteOp;

interface History {
  past: IFlowDefinition[];
  future: IFlowDefinition[];
}

interface SelectedFunctionDefinition {
  libraryName: string;
  funcName: string;
}

interface FlowStore {
  selectedNodeId: string | null;
  selectedLeafNodeId: string | null;
  selectedBranchOptionId: string | null;
  flowImplementationServerUrl: string | null;
  selectedFunctionDefinition: SelectedFunctionDefinition | null;
  flowImplementation: IFlowImplementation | null;
  defaultFlowState: Record<string, InteractiveFlowState<any>>;
  flowDefinitionHistory: Record<string, History>;
  flowCopyPasteState: Record<string, IFlowDefinitionNode> | null;

  setSelectedNodeId: (nodeId: string | null) => void;

  setSelectedLeafNodeId: (nodeId: string | null) => void;
  setSelectedBranchOptionId: (nodeId: string | null) => void;

  setFlowImplementation: (
    flowImplementation: IFlowImplementation | null
  ) => void;

  setSelectedFunctionDefinition: (
    def: SelectedFunctionDefinition | null
  ) => void;

  setFlowImplementationServerUrl: (url: string | null) => void;

  updateDefaultFlowState: (
    flowId: string,
    state: InteractiveFlowState<any>
  ) => void;

  updateFlowDefinitionHistory: (flowId: string, history: History) => void;

  setFlowCopyPasteState: (
    state: Record<string, IFlowDefinitionNode> | null
  ) => void;
}

export const useFlowStore = create<FlowStore>()((set, get) => ({
  flowImplementationServerUrl: getSelectedServer() || 'http://localhost:3201/api',

  flowImplementation: null,

  selectedNodeId: null,
  selectedBranchOptionId: null,
  selectedLeafNodeId: null,
  selectedFunctionDefinition: null,
  flowDefinitionHistory: {},
  defaultFlowState: {},
  flowCopyPasteState: null,

  setSelectedNodeId: (nodeId: string | null) =>
    set(() => ({ selectedNodeId: nodeId })),

  setSelectedLeafNodeId: (nodeId: string | null) =>
    set(() => ({ selectedLeafNodeId: nodeId })),

  setSelectedBranchOptionId: (nodeId: string | null) =>
    set(() => ({ selectedBranchOptionId: nodeId })),

  setFlowImplementation: (flowImplementation: IFlowImplementation | null) =>
    set(() => ({ flowImplementation: flowImplementation })),

  setSelectedFunctionDefinition: (def: SelectedFunctionDefinition | null) =>
    set(() => ({ selectedFunctionDefinition: def })),

  setFlowImplementationServerUrl: (url: string | null) => {
    // Just set the server url in local storage
    setSelectedServer(url);
    set(() => ({ flowImplementationServerUrl: url }));
  },

  updateDefaultFlowState: (
    flowId: string,
    state: InteractiveFlowState<any>
  ) => {
    set(() => ({
      defaultFlowState: {
        ...get().defaultFlowState,
        [flowId]: state,
      },
    }));
  },

  updateFlowDefinitionHistory: (flowId: string, history: History) => {
    set(() => ({
      flowDefinitionHistory: {
        ...get().flowDefinitionHistory,
        [flowId]: history,
      },
    }));
  },

  setFlowCopyPasteState: (
    state: Record<string, IFlowDefinitionNode> | null
  ) => {
    set(() => ({ flowCopyPasteState: state }));
  },
}));
