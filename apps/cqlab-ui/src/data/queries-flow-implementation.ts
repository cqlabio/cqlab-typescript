import axios from 'axios';
import { axiosInstance } from './axios-instance';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import {
  IFlowDefinition,
  IFlowImplementation,
  IFlowDefinitionNode,
  InteractiveFlowState,
  IFlowStepAnswer,
} from '@cqlab/cqflow-core';
import { LibraryContainerRegistry } from '@cqlab/cqdefine';
import { queryClient } from './queries';

const FLOW_INSTANCES_KEY = 'flowInstances';

export function useFlowImplementation(
  flowImplementationId: string | null,
  flowImplementationServer: string | null
) {
  return useQuery<IFlowImplementation>({
    enabled: !!flowImplementationId && !!flowImplementationServer,
    queryKey: [
      'flowImplementations',
      { id: flowImplementationId, server: flowImplementationServer },
    ],
    queryFn: async () => {
      const { data } = await axios.get(
        `${flowImplementationServer}/flow-implementations/${flowImplementationId}`
      );
      return data;
    },
  });
}

export function useFlowImplementationExampleData(
  flowImplementationId: string | null,
  flowImplementationServer: string | null
) {
  return useQuery<any[]>({
    enabled: !!flowImplementationId && !!flowImplementationServer,
    queryKey: [
      'flowImplementationExampleData',
      { id: flowImplementationId, server: flowImplementationServer },
    ],
    queryFn: async () => {
      const { data } = await axios.get(
        `${flowImplementationServer}/flow-implementations/${flowImplementationId}/example-inputs`
      );
      return data;
    },
  });
}

type WorkflowInstance = InteractiveFlowState<any>;

export function useFlowInstances(
  flowBindId: string | null,
  flowImplementationServer: string | null
) {
  return useQuery<WorkflowInstance[]>({
    enabled: !!flowBindId && !!flowImplementationServer,
    queryKey: [
      FLOW_INSTANCES_KEY,
      { id: flowBindId, server: flowImplementationServer },
    ],
    queryFn: async () => {
      const { data } = await axios.get(
        `${flowImplementationServer}/flows/${flowBindId}/flow-instances`
      );
      return data;
    },
  });
}

type AnswerPostBody = {
  stepId: string;
  answer: IFlowStepAnswer;
};

export function useAddFlowInstanceAnswerMutation(
  workflowInstanceId: string | null,
  flowImplementationServerUrl: string | null
) {
  return useMutation({
    mutationFn: (postBody: AnswerPostBody) => {
      return axiosInstance.post<WorkflowInstance>(
        `${flowImplementationServerUrl}/flow-instances/${workflowInstanceId}/answer`,
        postBody
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries([FLOW_INSTANCES_KEY]);
    },
  });

  // return useMutation({
  //   mutationFn: (stepId: string, answer: any) => {

  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries([FLOW_INSTANCES_KEY]);
  //   },
  // });
}

// axios
// .post<{ success: boolean }>(
//   ``,
//   {
//     stepId: stepId,
//     answer: answer,
//   }
// )
// .then(fetchActiveSteps);

// axios
// .post<WorkflowInstance>(
//   `${flowImplementationServerUrl}/launch-interactive/${flow.id}`,
//   {
//     initialData: testD,
//   }
// )
// .then((res) => {
//   fetchWorkflowInstances();
//   setSelectedWorkflowInstanceId(res.data.id);
// });

export function useCreateFlowInstanceMutation(
  flowBindId: string | null,
  flowImplementationServer: string | null
) {
  return useMutation({
    mutationFn: (initialdata: any) => {
      return axiosInstance.post<WorkflowInstance>(
        `${flowImplementationServer}/flows/${flowBindId}/launch-interactive`,
        {
          initialData: initialdata,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries([FLOW_INSTANCES_KEY]);
    },
  });
}

export function useDeleteFlowInstanceMutation(
  flowImplementationServer: string | null
) {
  return useMutation({
    mutationFn: (instanceId: string) => {
      return axiosInstance.delete<{ success: boolean }>(
        `${flowImplementationServer}/flow-instances/${instanceId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries([FLOW_INSTANCES_KEY]);
    },
  });
}

export function useLibraryRegistry(flowImplementationServer: string | null) {
  return useQuery<LibraryContainerRegistry>({
    queryKey: ['libraries', { server: flowImplementationServer }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<LibraryContainerRegistry>(
        `${flowImplementationServer}/libraries/registry`
      );
      return data;
    },
  });
}

type ValueSetSummary = {
  id: string;
  label: string;
};

export function useVocabularyValueSets(
  flowImplementationServer: string | null
) {
  return useQuery<ValueSetSummary[]>({
    enabled: !!flowImplementationServer,
    queryKey: ['valuesets', { server: flowImplementationServer }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ValueSetSummary[]>(
        `${flowImplementationServer}/vocabulary/value-sets`
      );
      return data;
    },
  });
}

export interface Coding {
  system: string;
  code: string;
  display: string;
}

export function useVocabularyValueSet(
  flowImplementationServer: string | null,
  valueSetId: string
) {
  return useQuery<Coding[]>({
    enabled: !!flowImplementationServer,
    queryKey: ['valuesets', { server: flowImplementationServer }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Coding[]>(
        `${flowImplementationServer}/vocabulary/value-sets/${valueSetId}`
      );
      return data;
    },
  });
}

export function useVocabularyCodes(flowImplementationServer: string | null) {
  return useQuery<Coding[]>({
    enabled: !!flowImplementationServer,
    queryKey: ['codes', { server: flowImplementationServer }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Coding[]>(
        `${flowImplementationServer}/vocabulary/codes`
      );
      return data;
    },
  });
}

type MockData = {
  id: string;
  label: string;
};

export function useMockData(flowImplementationServer: string | null) {
  return useQuery<MockData[]>({
    enabled: !!flowImplementationServer,
    queryKey: ['mockData', { server: flowImplementationServer }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<MockData[]>(
        `${flowImplementationServer}/mock-data`
      );
      return data;
    },
  });
}

type MockDataResolved = {
  id: string;
  label: string;
  data: any;
};

export function useMockDataById(
  flowImplementationServer: string | null,
  mockDataId: string
) {
  return useQuery<MockDataResolved>({
    enabled: !!mockDataId && !!flowImplementationServer,
    queryKey: [
      'mockData',
      { server: flowImplementationServer, id: mockDataId },
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get<MockDataResolved>(
        `${flowImplementationServer}/mock-data/${mockDataId}`
      );
      return data;
    },
  });
}
