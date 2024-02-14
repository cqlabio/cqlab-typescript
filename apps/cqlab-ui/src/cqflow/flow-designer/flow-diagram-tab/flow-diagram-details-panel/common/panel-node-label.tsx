import { useContext } from 'react';
import { IFlowDefinitionNode } from '@cqlab/cqflow-core';
import { PanelLabel } from './panel-label';
import { useFlowStore } from '../../../../flow-store';
import { EditableTextRow } from './editable-text-row';
import { FlowDesignerContext } from '../../../flow-designer-context';

type PanelNodeLabelProps = {
  node: IFlowDefinitionNode;
  onUpdateLabelOverride?: (nextLabel: string) => void;
};

export function PanelNodeLabel({
  node,
  onUpdateLabelOverride,
}: PanelNodeLabelProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const onUpdateLabel = (nextLabel: string) => {
    if (onUpdateLabelOverride) {
      onUpdateLabelOverride(nextLabel);
    } else {
      doNodeUpdates({
        op: 'update',
        node: {
          ...node,
          label: nextLabel,
        },
      });
    }
  };

  return (
    <>
      <PanelLabel label="Label" />
      <EditableTextRow value={node.label || ''} onSaveValue={onUpdateLabel} />
    </>
  );
}
