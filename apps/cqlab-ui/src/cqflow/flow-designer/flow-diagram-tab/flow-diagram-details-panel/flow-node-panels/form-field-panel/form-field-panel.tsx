import Box from '@mui/material/Box';
import { IFormFieldNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';
import { PanelLabel } from '../../common/panel-label';
import { PanelNodeLabel } from '../../common/panel-node-label';
import { PanelNodeId } from '../../common/panel-node-id';
import { PanelWrapper } from '../../common/panel-wrapper';
import { LinkNextSection } from '../../common/link-next-section';

import { FormFieldRouter } from './form-field-router';

type FormFieldPanelProps = {
  node: IFormFieldNode;
};

export function FormFieldPanel({ node }: FormFieldPanelProps) {
  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Form Field" nodeId={node.id} />

      <PanelNodeId node={node} />
      <PanelNodeLabel node={node} />

      <PanelLabel label="Field Type" />
      <FormFieldRouter node={node} />

      <LinkNextSection node={node} />
    </PanelWrapper>
  );
}
