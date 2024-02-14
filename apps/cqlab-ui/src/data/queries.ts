import { axiosInstance } from './axios-instance';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { IFlowDefinition } from '@cqlab/cqflow-core';

export const queryClient = new QueryClient();

export function useFlowDefinition(flowDefinitionId: string) {
  return useQuery<IFlowDefinition>({
    queryKey: ['flowDefinitions', { id: flowDefinitionId }],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`flows/${flowDefinitionId}`);
      return data;
    },
    enabled: !!flowDefinitionId,
  });
}

export function useFlowDefinitions() {
  return useQuery<IFlowDefinition[]>({
    queryKey: ['flowDefinitions'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('flows');
      return data;
    },
  });
}

export function useCreateFlowDefinitionMutation() {
  return useMutation({
    mutationFn: (flowDefinition: Omit<IFlowDefinition, 'id'>) => {
      return axiosInstance.post<IFlowDefinition>(`flows`, flowDefinition);
    },
    onSuccess: (res, variables) => {
      // console.log('askajsd', data, variables)
      queryClient.setQueryData(
        ['flowDefinitions', { id: res.data.id }],
        variables
      );
    },
  });
}

export function useUpdateFlowDefinitionMutation() {
  return useMutation({
    mutationFn: (flowDefinition: IFlowDefinition) => {
      return axiosInstance
        .put<{ success: true }>(`flows/${flowDefinition.id}`, flowDefinition)
        .then((res) => {
          console.log(`FlowDefinition ${flowDefinition.id} was updated`);
        });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['flowDefinitions', { id: variables.id }],
        variables
      );
    },
  });
}

export function useDeleteFlowDefinitionMutation() {
  return useMutation({
    mutationFn: (flowDefinitionId: string) => {
      return axiosInstance.delete<{ success: true }>(
        `flows/${flowDefinitionId}`
      );
    },
  });
}
