import { createContext } from 'react';
import { IFlowImplementation, IFlowDefinition } from '@cqlab/cqflow-core';

type FlowDiagramContextType = {
  selectedNodeId: string | null;
};

export const FlowDiagramContext = createContext<FlowDiagramContextType>({
  selectedNodeId: null,
});
