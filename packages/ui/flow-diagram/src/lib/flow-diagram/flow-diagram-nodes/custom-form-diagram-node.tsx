import { memo } from 'react';
import Box from '@mui/material/Box';
import RectangleDiagramNode from './common/rectangle-node';
import { ICustomFormNode } from '@cqlab/cqflow-core';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { NodeProps } from 'reactflow';
import { getNodeColor } from '../colors';

type CustomFormNodeProps = NodeProps<FlowNodeData<ICustomFormNode>>;

export const CustomFormDiagramNode = memo(
  ({ data, isConnectable }: CustomFormNodeProps) => {
    const { node, validationStatus, editMode } = data;

    return (
      <RectangleDiagramNode
        title="Custom Form"
        color={getNodeColor(node.nodeType)}
        flowNode={node}
        validationStatus={validationStatus}
        editMode={editMode}
      >
        <Box sx={{ textAlign: 'center' }}>{node.label}</Box>
      </RectangleDiagramNode>
    );
  }
);
