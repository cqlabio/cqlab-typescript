import { useQuery, QueryClient } from '@tanstack/react-query';
import {
  IFlowDefinition,
  IFlowImplementation,
  IFlowDefinitionNode,
} from '@cqlab/cqflow-core';
import axios from 'axios';

export const queryClient = new QueryClient();

export function useFlowDefinition(flowDefinitionId?: string) {
  return useQuery<IFlowDefinition>({
    queryKey: ['flowDefinitions', { id: flowDefinitionId }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/flows/${flowDefinitionId}`);
      return data;
    },
    enabled: !!flowDefinitionId,
  });
}
