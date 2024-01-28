import { memo } from 'react';
import Box from '@mui/material/Box';
import RectangleDiagramNode from './common/rectangle-node';
import { IEmitDataNode } from '@cqlab/cqflow-core';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { NodeProps } from 'reactflow';

type InputNodeProps = NodeProps<FlowNodeData<IEmitDataNode>>;

export const EmitDataDiagramNode = memo(
  ({ data, isConnectable }: InputNodeProps) => {
    const { node, validationStatus, editMode } = data;

    return (
      <RectangleDiagramNode
        title="Emit Data"
        // color="#D0A000"
        flowNode={node}
        validationStatus={validationStatus}
        editMode={editMode}
      >
        <Box sx={{ textAlign: 'center' }}>{node.label}</Box>
      </RectangleDiagramNode>
    );
  }
);
