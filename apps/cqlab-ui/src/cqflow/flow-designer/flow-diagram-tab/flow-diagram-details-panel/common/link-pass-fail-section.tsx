import { useContext } from 'react';
import Box from '@mui/material/Box';
import { NextNode } from './next-node';
import { IFlowDefinitionBooleanNode } from '@cqlab/cqflow-core';
import { PanelLabel } from './panel-label';
import { useFlowStore } from '../../../../flow-store';
import { FlowDesignerContext } from '../../../flow-designer-context';

type LinkPassFailSectionProps = {
  node: IFlowDefinitionBooleanNode;
};

export function LinkPassFailSection({ node }: LinkPassFailSectionProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const onClearPass = () => {
    const { next } = node;
    if (next) {
      doNodeUpdates({
        op: 'update',
        node: {
          ...node,
          next: {
            ...next,
            trueId: undefined,
          },
        },
      });
    }
  };

  const onClearFail = () => {
    const { next } = node;
    if (next) {
      doNodeUpdates({
        op: 'update',
        node: {
          ...node,
          next: {
            ...next,
            falseId: undefined,
          },
        },
      });
    }
  };

  return (
    <>
      <PanelLabel label="On True" />
      <Box>
        <NextNode nextId={node.next?.trueId} onClear={onClearPass} />
      </Box>

      <PanelLabel label="On False" />
      <Box>
        <NextNode nextId={node.next?.falseId} onClear={onClearFail} />
      </Box>
    </>
  );
}
