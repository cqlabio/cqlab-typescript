import Box from '@mui/material/Box';
import { IActionNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';
import { PanelLabel } from '../../common/panel-label';
import { PanelNodeLabel } from '../../common/panel-node-label';
import { PanelNodeId } from '../../common/panel-node-id';
import { PanelWrapper } from '../../common/panel-wrapper';
import { LinkNextSection } from '../../common/link-next-section';
import { ActionList } from './action-list';

type ActionPanelProps = {
  node: IActionNode;
};

export function ActionPanel({ node }: ActionPanelProps) {
  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Action" nodeId={node.id} />

      <PanelNodeId node={node} />
      <PanelNodeLabel node={node} />

      <ActionList node={node} />

      <LinkNextSection node={node} />
    </PanelWrapper>
  );
}
