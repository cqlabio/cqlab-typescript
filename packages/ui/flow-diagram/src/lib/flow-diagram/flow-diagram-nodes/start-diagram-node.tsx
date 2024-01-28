import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { IStartNode } from '@cqlab/cqflow-core';
import { FlowNodeData } from '../convert-nodes-and-edges';
import { CircleDiagramNode } from './common/circle-node';

type InputNodeProps = NodeProps<FlowNodeData<IStartNode>>;

export const StartNode = memo(({ data }: InputNodeProps) => {
  const { node, validationStatus } = data;
  return (
    <CircleDiagramNode
      label="Start"
      node={node}
      validationStatus={validationStatus}
    />
  );
});
