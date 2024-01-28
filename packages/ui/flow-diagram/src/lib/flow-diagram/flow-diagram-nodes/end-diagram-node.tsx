import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { IEndNode } from '@cqlab/cqflow-core';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { CircleDiagramNode } from './common/circle-node';

type InputNodeProps = NodeProps<FlowNodeData<IEndNode>>;

export const EndDiagramNode = memo(({ data }: InputNodeProps) => {
  const { node, validationStatus } = data;

  return (
    <CircleDiagramNode
      label="End"
      node={node}
      validationStatus={validationStatus}
      displayDropBox
    />
  );
});
