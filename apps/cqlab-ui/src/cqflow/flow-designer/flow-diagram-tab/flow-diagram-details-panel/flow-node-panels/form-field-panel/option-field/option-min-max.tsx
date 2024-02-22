import { useState, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { IMultiOptionFieldNode } from '@cqlab/cqflow-core';
import { OptionEditMinMax } from './option-edit-min-max';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/EditOutlined';

const labelStyle = {
  textTransform: 'uppercase',
  fontSize: '13px',
  color: 'rgb(70,70,70)',
  fontFamily: 'Nunito',
  padding: '8px 0',
};

export interface MinMax {
  min: number;
  max: number | null;
}

type OptionMinMaxProps = {
  node: MinMax;
  onUpdateMinMax: (node: MinMax) => void;
};

export function OptionMinMax({ node, onUpdateMinMax }: OptionMinMaxProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  if (isEditing) {
    return (
      <OptionEditMinMax
        node={node}
        toggleEdit={toggleEdit}
        onUpdateMinMax={onUpdateMinMax}
      />
    );
  }

  let content: ReactNode = null;

  if (node.min === 1 && node.max === 1) {
    content = <Box sx={labelStyle}>Select exactly one option</Box>;
  } else if (node.min === 0 && node.max === null) {
    content = <Box sx={labelStyle}>Select any number of options</Box>;
  } else {
    content = (
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Box>Min = {`${node.min || 0}`}</Box>
        <Box>Max = {`${node.max === null ? 'any' : node.max}`}</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>
        {content}
        <Box sx={{ display: 'flex', gap: '15px', fontSize: '15px' }}>
          <Box>
            <Box
              component="span"
              sx={{ color: 'rgb(110,110,110)', marginRight: '4px' }}
            >
              Min =
            </Box>
            {`${node.min || 0}`}
          </Box>
          <Box>
            <Box
              component="span"
              sx={{ color: 'rgb(110,110,110)', marginRight: '4px' }}
            >
              Max =
            </Box>
            {`${node.max === null ? 'any' : node.max}`}
          </Box>
        </Box>
      </Box>
      <Box>
        <IconButton
          size="small"
          onClick={toggleEdit}
          sx={{ marginLeft: '5px', padding: '2px' }}
        >
          <EditIcon sx={{ color: 'rgb(180,180,180)', fontSize: '16px' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
