import { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import { Next } from '@cqlabio/shared/types';
import RemoveOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { FlowDesignerContext } from '../../../flow-designer-context';

type NextNodeProps = {
  nextId: string | undefined;
  onClear: () => void;
};

export function NextNode({ nextId, onClear }: NextNodeProps) {
  const { flowDefinition } = useContext(FlowDesignerContext);

  const node = flowDefinition.nodes[nextId || ''];

  if (!node) {
    return (
      <Box
        sx={{ color: 'rgb(150,150,150)', fontWeight: 300, fontSize: '14px' }}
      >
        Not configured
      </Box>
    );
  }

  return (
    <Box sx={{ fontSize: '13px', display: 'flex' }}>
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <SubdirectoryArrowRightIcon
          sx={{
            fontSize: '14px',
            color: '#1e88e5',
            position: 'relative',
            top: '2px',
          }}
        />
        {node.label || node.id}
      </Box>
      <IconButton
        className="row-icon"
        size="small"
        onClick={onClear}
        sx={{
          color: 'rgb(170,170,170)',
          marginLeft: '5px',
          padding: '2px',
        }}
      >
        <RemoveOutlinedIcon sx={{ fontSize: '16px' }} />
      </IconButton>
    </Box>
  );
}
