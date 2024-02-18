import { useContext } from 'react';
import Box from '@mui/material/Box';
import { LinkPassFailSection } from '../../common/link-pass-fail-section';
import { ISubFlowNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';
import { PanelLabel } from '../../common/panel-label';
import { PanelNodeLabel } from '../../common/panel-node-label';
import { EditableTextRow } from '../../common/editable-text-row';
import { PanelWrapper } from '../../common/panel-wrapper';
import { PanelValidationSection } from '../../common/panel-validation-section';
import { useFlowStore } from '../../../../../flow-store';
import { FlowDesignerContext } from '../../../../flow-designer-context';
import { PanelNodeId } from '../../common/panel-node-id';
import { SubFlowAutoComplete } from './subflow-autocomplete';

type SubFlowPanelProps = {
  node: ISubFlowNode;
};

export function SubFlowPanel({ node }: SubFlowPanelProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const onUpdateSubFlowId = (subFlowId: string) => {
    doNodeUpdates({
      op: 'update',
      node: {
        ...node,
        subFlowId: subFlowId,
      },
    });
  };

  return (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Sub-Flow" nodeId={node.id} />
      <PanelNodeId node={node} />
      {/* <PanelNodeLabel node={node} />

      
      {!skipPassFail && <LinkPassFailSection node={node} />} */}
      <PanelLabel label="Sub Flow" />

      {/* <EditableTextRow
        value={node.subFlowId || ''}
        onSaveValue={onUpdateLabel}
      /> */}

      <SubFlowAutoComplete
        subFlowId={node.subFlowId}
        onUpdateSubFlowId={onUpdateSubFlowId}
      />

      <PanelValidationSection nodeId={node.id} />
    </PanelWrapper>
  );
}
