import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import first from 'lodash/first';
import { IFlowDefinition, IFlowDefinitionNode } from '@cqlab/cqflow-core';
import { IValidationFlowDefinition } from '../../../../data/do-validation';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useReactFlow } from 'reactflow';

type FlowDiagramErrorsProps = {
  validationResults: IValidationFlowDefinition[];
};

export function FlowDiagramErrors({
  validationResults,
}: FlowDiagramErrorsProps) {
  const reactFlowInstance = useReactFlow();

  const onZoomTo = (node: IFlowDefinitionNode) => {
    if (node.position) {
      const zoom = reactFlowInstance.getZoom();
      reactFlowInstance.setCenter(node.position.x, node.position.y, {
        zoom,
      });
    } else {
      console.log(
        'TODO: get position for Logic Node / Linear Eval parent nodes'
      );
    }
  };

  const errorRows = validationResults.map((validationResult) => {
    // if (validationResult.type === 'flow-error') {
    //   return <Box>{validationResult.message}</Box>;
    // }

    if (validationResult.type === 'definition-node-error') {
      return (
        <Box
          key={validationResult.node.id}
          sx={{
            display: 'flex',
            padding: '3px 7px',
            background: 'rgb(253, 237, 237)',
            borderBottom: '1px solid #FED4DA',
            color: 'black',
          }}
        >
          <Box>{validationResult.node.nodeType}</Box>
          <Box
            onClick={() => onZoomTo(validationResult.node)}
            sx={{
              fontWeight: 300,
              marginLeft: '5px',
              cursor: 'pointer',
              ':hover': {
                textDecoration: 'underline',
              },
            }}
          >
            [{validationResult.node.bindId || validationResult.node.id}]:
          </Box>
          <Box sx={{ color: 'secondary.main', paddingLeft: '5px' }}>
            {first(validationResult.messages)}
          </Box>
          <Box></Box>
        </Box>
      );
    }
  });

  return (
    <Paper
      square
      sx={{
        height: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid rgb(230,230,230)',
      }}
    >
      <Paper
        square
        elevation={1}
        sx={{
          padding: '8px 10px',
          fontWeight: 300,
          color: '#D12733',
          borderBottom: '1px solid rgb(230,230,230)',
          // background: 'rgb(250,250,250)',
        }}
      >
        Validation - {validationResults.length}{' '}
        {validationResults.length === 1 ? 'error' : 'errors'}
      </Paper>

      <Box sx={{ overflowY: 'scroll', flexGrow: 1 }}>{errorRows}</Box>
    </Paper>
  );
}
