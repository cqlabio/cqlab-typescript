import { memo } from 'react';
import Box from '@mui/material/Box';
import RectangleDiagramNode from './common/rectangle-node';
import { IMultiOptionFieldNode } from '@cqlab/cqflow-core';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { NodeProps } from 'reactflow';
import { getNodeColor } from '../colors';
import { alphabet } from './common/multi-choice-picker';

type OptionSelectNodeProps = NodeProps<FlowNodeData<IMultiOptionFieldNode>>;

export const MultiOptionFieldDiagramNode = memo(
  ({ data, isConnectable }: OptionSelectNodeProps) => {
    const { node, validationStatus, editMode } = data;

    return (
      <RectangleDiagramNode
        title="Option Select"
        color={getNodeColor(node.nodeType)}
        flowNode={node}
        editMode={editMode}
      >
        <Box sx={{ paddingBottom: '3px', paddingLeft: '5px' }}>
          {node.label}
        </Box>

        {node.field.options.map((option, index) => (
          <Box sx={{ display: 'flex' }} key={index}>
            <Box sx={{ padding: '0 5px' }}>{[index + 1]})</Box>
            <Box sx={{ fontWeight: 300 }}>{option.label}</Box>
          </Box>
        ))}
      </RectangleDiagramNode>
    );
  }
);
