import { useContext } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { FlowDesignerContext } from '../../../flow-designer-context';

type NodeTypeWithDeleteProps = {
  label: string;
  nodeId: string;
};

export function NodeTypeWithDelete({ label, nodeId }: NodeTypeWithDeleteProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const deleteNodeById = (nodeId: string) => {
    doNodeUpdates({
      op: 'delete',
      nodeId: nodeId,
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ color: 'secondary.main', flexGrow: 1 }}>{label}</Box>
      <Box>
        <IconButton
          className="row-icon"
          size="small"
          onClick={() => deleteNodeById(nodeId)}
          sx={{
            padding: '2px',
          }}
        >
          <DeleteIcon sx={{ fontSize: '20px', color: 'rgb(150,150,150)' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
