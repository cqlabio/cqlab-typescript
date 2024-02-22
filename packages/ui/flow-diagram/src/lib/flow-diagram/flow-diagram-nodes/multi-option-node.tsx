import { memo } from 'react';
import Box from '@mui/material/Box';
import RectangleDiagramNode from './common/rectangle-node';
import { IMultiOptionNode } from '@cqlab/cqflow-core';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { NodeProps } from 'reactflow';
import { getNodeColor } from '../colors';
import { alphabet } from './common/multi-choice-picker';

type OptionSelectNodeProps = NodeProps<FlowNodeData<IMultiOptionNode>>;

export const MultiOptionDiagramNode = memo(
  ({ data, isConnectable }: OptionSelectNodeProps) => {
    const { node, validationStatus, editMode } = data;

    return (
      <RectangleDiagramNode
        title="Multi Option"
        color={getNodeColor(node.nodeType)}
        flowNode={node}
        editMode={editMode}
      >
        <Box sx={{ paddingBottom: '0px', paddingLeft: '5px' }}>
          {node.label}
        </Box>

        <Box
          sx={{
            paddingBottom: '3px',
            paddingLeft: '5px',
            color: 'rgb(130,130,130)',
            fontStyle: 'italic',
          }}
        >
          Choose at least {node.min} for TRUE path
        </Box>

        {node.options.map((option, index) => (
          <Box sx={{ display: 'flex' }} key={index}>
            <Box sx={{ padding: '0 5px' }}>{[index + 1]})</Box>
            <Box sx={{ fontWeight: 300 }}>{option.label}</Box>
          </Box>
        ))}
      </RectangleDiagramNode>
    );
  }
);
