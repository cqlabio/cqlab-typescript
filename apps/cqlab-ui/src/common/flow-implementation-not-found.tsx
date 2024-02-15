import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useFlowStore } from '../cqflow/flow-store';

type FlowImplemtationNotFoundProps = {
  flowImplementationServerUrl: string | null;
  bindId?: string | null;
};

export function FlowImplementationNotFound({
  bindId,
}: FlowImplemtationNotFoundProps) {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  return (
    <Paper sx={{ padding: '15px', margin: '25px' }}>
      <Box sx={{ paddingBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
        Not Found
      </Box>

      {!flowImplementationServerUrl ? (
        <Box>Implementation server is not configured.</Box>
      ) : (
        <Box>
          We were unable to find the flow implementation with id{' '}
          <Box component="span" sx={{ color: 'secondary.main' }}>
            {bindId}
          </Box>{' '}
          on implementation server{' '}
          <Box component="span" sx={{ color: 'secondary.main' }}>
            {flowImplementationServerUrl}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
