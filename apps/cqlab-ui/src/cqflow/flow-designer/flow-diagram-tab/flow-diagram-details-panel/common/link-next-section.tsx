import { useContext } from 'react';
import Box from '@mui/material/Box';
import { NextNode } from './next-node';
import { IFlowDefinitionNextNode } from '@cqlab/cqflow-core';
import { PanelLabel } from './panel-label';
import { FlowDesignerContext } from '../../../flow-designer-context';

type LinkNextSectionProps = {
  node: IFlowDefinitionNextNode;
};

export function LinkNextSection({ node }: LinkNextSectionProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  // const doNodeUpdates = useFlowStore((state) => state.doNodeUpdates);

  const onClearNext = () => {
    const { next } = node;
    if (next) {
      doNodeUpdates({
        op: 'update',
        node: {
          ...node,
          next: {
            ...next,
            id: undefined,
          },
        },
      });
    }
  };

  return (
    <>
      <PanelLabel label="Next" />
      <Box>
        <NextNode nextId={node.next?.id} onClear={onClearNext} />
      </Box>
    </>
  );
}
