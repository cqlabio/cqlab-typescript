import { IActionNode } from '@cqlab/cqflow-core';
import { EditableTextRowNumber } from '../../common/editable-text-row-number';
import Box from '@mui/material/Box';
import { useContext } from 'react';
import { FlowDesignerContext } from '../../../../flow-designer-context';

type ActionMinProps = {
  node: {
    min: number;
  };
  onUpdateMin: (val: number) => void;
};

export function ActionMin({ node, onUpdateMin }: ActionMinProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ paddingRight: '5px' }}>Minimum Required:</Box>

      <Box sx={{ flexGrow: 1 }}>
        <EditableTextRowNumber
          value={node.min || 0}
          onSaveValue={onUpdateMin}
        />
      </Box>
    </Box>
  );
}
