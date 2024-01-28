import Box from '@mui/material/Box';
import { useFlowDefinition } from './subflow-query';

type FlowDefinitionNameProps = {
  flowId: string;
};

export function FlowDefinitionName({ flowId }: FlowDefinitionNameProps) {
  const { data: flowDefinition, isFetching } = useFlowDefinition(flowId);

  return <Box textAlign="center">{flowDefinition?.bindId || flowId}</Box>;
}
