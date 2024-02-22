import { INarrativeNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../common/node-type-with-delete';
import { PanelLabel } from '../common/panel-label';
import { PanelNodeLabel } from '../common/panel-node-label';
import { PanelNodeId } from '../common/panel-node-id';
import { PanelWrapper } from '../common/panel-wrapper';
import { LinkNextSection } from '../common/link-next-section';

type MessagePanelProps = {
  node: INarrativeNode;
};

export function NarrativeNodePanel({ node }: MessagePanelProps) {
  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Narrative" nodeId={node.id} />

      <PanelNodeId node={node} />

      <PanelNodeLabel node={node} />
      <PanelLabel label="Narrative" />

      <LinkNextSection node={node} />
    </PanelWrapper>
  );
}
