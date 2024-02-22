import React, { memo } from 'react';
import Box from '@mui/material/Box';
import RectangleDiagramNode from './common/rectangle-node';
import { IBranchNode } from '@cqlab/cqflow-core';
import { NodeProps } from 'reactflow';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { alphabet } from './common/multi-choice-picker';

// type UserDecisionNodeProps = {
//   data: IBranchNode;
//   isConnectable: boolean;
// };

type InputNodeProps = NodeProps<FlowNodeData<IBranchNode>>;

export const BranchChoiceDiagramNode = memo(
  ({ data, isConnectable }: InputNodeProps) => {
    const { node, validationStatus, editMode } = data;

    return (
      <RectangleDiagramNode
        title="Branch"
        // color="#7B1FA2"
        // color="#1976D2"
        flowNode={node}
        validationStatus={validationStatus}
        editMode={editMode}
      >
        {node.label}

        {node.next?.options.map((option: any, index: number) => (
          <Box sx={{ display: 'flex' }} key={index}>
            <Box sx={{ padding: '0 5px' }}>{alphabet[index]})</Box>
            <Box sx={{ fontWeight: 300 }}>{option.label}</Box>
          </Box>
        ))}
      </RectangleDiagramNode>
    );
  }
);
