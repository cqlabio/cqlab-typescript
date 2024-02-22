import Box from '@mui/material/Box';
import { useFlowDefinition } from './subflow-query';
import { Link } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';

type FlowDefinitionNameProps = {
  flowId?: string;
};

export function FlowDefinitionName({ flowId }: FlowDefinitionNameProps) {
  const { data: flowDefinition, isFetching } = useFlowDefinition(flowId);

  if (!flowId) {
    return (
      <Box textAlign="center" sx={{ color: 'rgb(130,130,130)' }}>
        Not Configured
      </Box>
    );
  }

  if (!flowDefinition) {
    if (isFetching) {
      return <Box textAlign="center">Loading...</Box>;
    }

    return <Box textAlign="center">Flow Definition not found: {flowId}</Box>;
  }

  return (
    <Box textAlign="center">
      <Box sx={{ color: 'black', display: 'flex', alignItems: 'center' }}>
        <Link
          to={`/flow/${flowDefinition.id}`}
          style={{ textDecoration: 'none', padding: 0 }}
        >
          <LinkIcon
            sx={{
              fontSize: '18px',
              color: 'secondary.main',
              marginRight: '5px',
              position: 'relative',
              top: '3px',
            }}
          />
        </Link>
        <Box>{flowDefinition.bindId}</Box>
      </Box>
    </Box>
  );
}
