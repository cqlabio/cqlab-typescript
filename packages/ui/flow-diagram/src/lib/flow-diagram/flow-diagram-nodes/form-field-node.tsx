import React, { memo, useState, LegacyRef, ReactNode } from 'react';
// import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import { Resizable } from 'react-resizable';
// import ResizableDiv from './RectangleDiagramNode'
import RectangleDiagramNode from './common/rectangle-node';
import {
  FieldTypeEnum,
  IFormFieldNode,
  INarrativeNode,
} from '@cqlab/cqflow-core';
// import { NarrativeFlowNode } from '../../';
// import { ReactFlowNode, FlowNodeTypeEnum } from '@cqlabio/shared/types';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { NodeProps } from 'reactflow';
// import { getNodeColor } from '../../../colors'

type FormFieldNodeProps = NodeProps<FlowNodeData<IFormFieldNode>>;

export const FormFieldDiagramNode = memo(({ data }: FormFieldNodeProps) => {
  const { node, validationStatus, editMode } = data;

  let title = `${node.fieldType} Field`;
  let content: ReactNode = <Box sx={{ textAlign: 'center' }}>{node.label}</Box>;

  if (node.fieldType === FieldTypeEnum.MultiOption) {
    title = 'Multi-Option Field';
    content = (
      <Box>
        <Box sx={{ paddingBottom: '3px', paddingLeft: '5px' }}>
          {node.label}
        </Box>

        {node.field.options.map((option, index) => (
          <Box sx={{ display: 'flex' }} key={index}>
            <Box sx={{ padding: '0 5px' }}>{[index + 1]})</Box>
            <Box sx={{ fontWeight: 300 }}>{option.label}</Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <RectangleDiagramNode
      title={title}
      flowNode={node}
      validationStatus={validationStatus}
      editMode={editMode}
    >
      {content}
    </RectangleDiagramNode>
  );
});
