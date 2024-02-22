import Box from '@mui/material/Box';
import { ICustomFormNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../common/node-type-with-delete';
import { PanelLabel } from '../common/panel-label';
import { PanelNodeLabel } from '../common/panel-node-label';
import { PanelWrapper } from '../common/panel-wrapper';
import { PanelValidationSection } from '../common/panel-validation-section';
import { PanelNodeId } from '../common/panel-node-id';
import { LinkNextSection } from '../common/link-next-section';

type CustomFormPanelProps = {
  node: ICustomFormNode;
};

export function CustomFormPanel({ node }: CustomFormPanelProps) {
  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Custom Form" nodeId={node.id} />

      <PanelNodeLabel node={node} />
      <PanelNodeId node={node} />
      <LinkNextSection node={node} />

      <PanelValidationSection nodeId={node.id} />
    </PanelWrapper>
  );
}
