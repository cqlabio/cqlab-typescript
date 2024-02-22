import Box from '@mui/material/Box';
import { IEmitDataNode, IMultiOptionNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';
import { PanelLabel } from '../../common/panel-label';
import { PanelNodeLabel } from '../../common/panel-node-label';
import { PanelWrapper } from '../../common/panel-wrapper';
import { PanelValidationSection } from '../../common/panel-validation-section';
import { PanelNodeId } from '../../common/panel-node-id';
import { LinkNextSection } from '../../common/link-next-section';
import { MultiOptionList } from './multi-option-list';
import { LinkPassFailSection } from '../../common/link-pass-fail-section';

type MultiOptionPanelProps = {
  node: IMultiOptionNode;
};

export function MultiOptionPanel({ node }: MultiOptionPanelProps) {
  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Multi Option" nodeId={node.id} />

      <PanelNodeLabel node={node} />
      <PanelNodeId node={node} />
      {/* <LinkNextSection node={node} /> */}

      <MultiOptionList node={node} />
      {/* <PanelValidationSection nodeId={node.id} /> */}
      <LinkPassFailSection node={node} />
    </PanelWrapper>
  );
}
