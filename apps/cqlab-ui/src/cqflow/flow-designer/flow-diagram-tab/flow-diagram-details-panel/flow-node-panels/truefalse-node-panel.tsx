import Box from '@mui/material/Box';

import { LinkPassFailSection } from '../common/link-pass-fail-section';
import { ITrueFalseNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../common/node-type-with-delete';
import { PanelLabel } from '../common/panel-label';
import { PanelNodeLabel } from '../common/panel-node-label';
import { PanelNodeId } from '../common/panel-node-id';
import { PanelWrapper } from '../common/panel-wrapper';
import { PanelValidationSection } from '../common/panel-validation-section';

type YesNoPanelProps = {
  node: ITrueFalseNode;
  skipPassFail?: boolean;
};

export function TrueFalsePanel({ node, skipPassFail }: YesNoPanelProps) {
  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="True/False" nodeId={node.id} />

      <PanelNodeLabel node={node} />

      <PanelNodeId node={node} />
      {!skipPassFail && <LinkPassFailSection node={node} />}

      {/* <PanelValidationSection nodeId={node.id} /> */}
    </PanelWrapper>
  );
}
