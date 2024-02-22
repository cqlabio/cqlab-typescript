import React, { memo, useState, LegacyRef } from 'react';
// import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import { Resizable } from 'react-resizable';
// import ResizableDiv from './RectangleDiagramNode'
import RectangleDiagramNode from './common/rectangle-node';
import { INarrativeNode } from '@cqlab/cqflow-core';
// import { NarrativeFlowNode } from '../../';
// import { ReactFlowNode, FlowNodeTypeEnum } from '@cqlabio/shared/types';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { NodeProps } from 'reactflow';
// import { getNodeColor } from '../../../colors'

type InputNodeProps = NodeProps<FlowNodeData<INarrativeNode>>;

export const NarrativeDiagramNode = memo(({ data }: InputNodeProps) => {
  const { node, validationStatus, editMode } = data;

  return (
    <RectangleDiagramNode
      title="Narrative"
      flowNode={node}
      validationStatus={validationStatus}
      editMode={editMode}
      // backgroundColor='#E3F2FD'
      backgroundColor="#E0F7FA"
      color="#006064"
      border="1px solid #B2DFDB"
    >
      <Box sx={{ textAlign: 'center' }}>{node.label}</Box>
    </RectangleDiagramNode>
  );
});
