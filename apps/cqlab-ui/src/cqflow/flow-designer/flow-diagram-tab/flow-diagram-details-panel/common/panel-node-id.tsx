import { useContext, useState } from 'react';
import { IFlowDefinitionNode } from '@cqlab/cqflow-core';
import { PanelLabel } from './panel-label';
import { useFlowStore } from '../../../../flow-store';
import { EditableTextRow } from './editable-text-row';
import { FlowDesignerContext } from '../../../flow-designer-context';
import { validateNodeBindId } from '../../../../../data/validation';
import { Alert } from '@mui/material';

type PanelNodeIdProps = {
  node: IFlowDefinitionNode;
  onUpdateBindIdOverride?: (bindId: string) => void;
};

export function PanelNodeId({
  node,
  onUpdateBindIdOverride,
}: PanelNodeIdProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const onUpdateBindId = (nextId: string) => {
    if (onUpdateBindIdOverride) {
      onUpdateBindIdOverride(nextId);
    } else {
      doNodeUpdates({
        op: 'update',
        node: {
          ...node,
          bindId: nextId,
        },
      });
    }
  };

  const bindIdValidator = (bindId: string): string | null => {
    if (!validateNodeBindId(bindId)) {
      return 'Bind id must have lowercase letters, numbers, underscores only. For example: my_id_1';
    }
    return null;
  };

  return (
    <>
      <PanelLabel label="Bind Id" />
      <EditableTextRow
        value={node.bindId || ''}
        onSaveValue={onUpdateBindId}
        validator={bindIdValidator}
      />
    </>
  );
}
