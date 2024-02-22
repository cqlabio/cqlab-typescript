import React, { memo, useState, LegacyRef } from 'react';
import Box from '@mui/material/Box';

import RectangleDiagramNode from './common/rectangle-node';
import { INarrativeNode, INoteNode } from '@cqlab/cqflow-core';
// import { NarrativeFlowNode } from '../../';
// import { ReactFlowNode, FlowNodeTypeEnum } from '@cqlabio/shared/types';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { NodeProps, NodeResizeControl } from 'reactflow';
// import { getNodeColor } from '../../../colors'
// import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ResizeIcon } from './common/rectangle-node';

type InputNodeProps = NodeProps<FlowNodeData<INoteNode>>;

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

export const NoteDiagramNode = memo(({ data }: InputNodeProps) => {
  const { node, validationStatus, editMode } = data;

  return (
    <Paper
      elevation={0}
      square
      sx={{
        height: '100%',
        // borderRadius: '10px',
        position: 'relative',
        // cursor: isTarget ? 'crosshair' : 'default',
        padding: '3px 0px 2px 0px',
        // fontSize: '12px',
        display: 'flex',
        background: '#E1F5FE',
        border: `1px dashed #2196F3`,
        // boxShadow: isSelected ? `0 1px 8px -2px ${nodeColor}` : 'inehrit',
        // boxShadow: `0 0 15px 2px ${nodeColor}`,

        flexDirection: 'column',
        '.resize-icon': {
          display: 'none',
        },
        ':hover': {
          '.resize-icon': {
            display: 'inherit',
          },
        },
      }}
    >
      <Box
        sx={{
          // fontWeight: 'bold',
          paddingTop: '2px',
          paddingBottom: '3px',
          // color: color,
          position: 'relative',
          textAlign: 'center',
          fontFamily: 'Red Hat Display var(--cq-title-font)',
          fontWeight: 600,
          // color: 'sec',
        }}
      >
        <Box sx={{ color: '#0D47A1', fontSize: '12px' }}>Note</Box>
      </Box>

      <Box sx={{ padding: '10px', overflowY: 'hidden', fontSize: '14px' }}>
        {node.contents}
      </Box>

      <NodeResizeControl style={controlStyle} minWidth={150} minHeight={60}>
        <ResizeIcon />
      </NodeResizeControl>
    </Paper>
  );
});
