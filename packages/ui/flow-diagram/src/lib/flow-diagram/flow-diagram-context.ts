import { createContext } from 'react';
import { IFlowImplementation, IFlowDefinition } from '@cqlab/cqflow-core';

export interface CreatingEdge {
  sourceId: string;
  index?: number;
}

type FlowDiagramContextType = {
  selectedNodeId: string | null;
  creatingEdge: CreatingEdge | null;
  updateCreatingEdge: (creatingEdge: CreatingEdge | null) => void;
};

export const FlowDiagramContext = createContext<FlowDiagramContextType>({
  selectedNodeId: null,
  creatingEdge: null,
  updateCreatingEdge: () => null,
});
