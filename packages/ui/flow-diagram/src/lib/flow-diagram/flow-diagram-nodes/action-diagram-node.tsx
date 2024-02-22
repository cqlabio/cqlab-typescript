import React, { memo, useState, LegacyRef } from 'react';
// import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import { Resizable } from 'react-resizable';
// import ResizableDiv from './RectangleDiagramNode'
import RectangleDiagramNode from './common/rectangle-node';
import { IActionNode } from '@cqlab/cqflow-core';
// import { CqlFlowNode } from '@cqlabio/shared/types';
// import { ReactFlowNode, FlowNodeTypeEnum } from '@cqlabio/shared/types';
import { NodeProps } from 'reactflow';
import { FlowNodeData } from '../convert-nodes-and-edges';

type InputNodeProps = NodeProps<FlowNodeData<IActionNode>>;

export const ActionDiagramNode = memo(
  ({ data, isConnectable }: InputNodeProps) => {
    const { node, validationStatus, editMode } = data;

    return (
      <RectangleDiagramNode
        title="Action"
        // color="#FBC02D"
        flowNode={node}
        editMode={editMode}
        validationStatus={validationStatus}
      >
        <Box sx={{ paddingBottom: '3px', paddingLeft: '5px' }}>
          {node.label}
        </Box>

        {node.actions.map((action, index) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              paddingBottom: '3px',
            }}
            key={index}
          >
            <Box sx={{ padding: '0 5px' }}>{[index + 1]})</Box>
            <Box
              sx={{
                background: '#E1F5FE',
                border: '1px solid #81D4FA',
                color: '#0D47A1',
                padding: '0 5px',
                borderRadius: '4px',
                fontSize: '12px',
                marginRight: '4px',
              }}
            >
              {action.actionType}
            </Box>
            <Box sx={{ fontWeight: 300 }}>{action.label}</Box>
          </Box>
        ))}
      </RectangleDiagramNode>
    );
  }
);
