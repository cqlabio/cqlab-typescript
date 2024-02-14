import Box from '@mui/material/Box';
import { IEmitDataNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../common/node-type-with-delete';
import { PanelLabel } from '../common/panel-label';
import { PanelNodeLabel } from '../common/panel-node-label';
import { PanelWrapper } from '../common/panel-wrapper';
import { PanelValidationSection } from '../common/panel-validation-section';
import { PanelNodeId } from '../common/panel-node-id';
import { LinkNextSection } from '../common/link-next-section';

type EmitDataPanelProps = {
  node: IEmitDataNode;
};

export function EmitDataPanel({ node }: EmitDataPanelProps) {
  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Emit Data" nodeId={node.id} />

      <PanelNodeLabel node={node} />
      <PanelNodeId node={node} />
      <LinkNextSection node={node} />

      <PanelValidationSection nodeId={node.id} />
    </PanelWrapper>
  );
}
