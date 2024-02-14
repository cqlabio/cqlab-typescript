import { ReactNode, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useFlowStore } from '../../../../../flow-store';
import { FlowDesignerContext } from '../../../../flow-designer-context';
import { shallow } from 'zustand/shallow';
// import { ExecPanel } from '../truefalse-node-panel';
// import { YesNoPanel } from '../yesno-node-panel';
import {
  IFlowDefinitionNode,
  DefinitionNodeTypeEnum,
  ITrueFalseLeaf,
} from '@cqlab/cqflow-core';
import { TrueFalsePanel } from '../truefalse-node-panel';

import { PanelLabel } from '../../common/panel-label';
import { PanelNodeLabel } from '../../common/panel-node-label';
import { PanelNodeId } from '../../common/panel-node-id';
import { PanelWrapper } from '../../common/panel-wrapper';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';

type SelectedReferencePanelProps = {
  leafNode: ITrueFalseLeaf;
  updateLeafNode: (leafNode: ITrueFalseLeaf) => void;
};

export function SelectedTrueFalseLeafPanel({
  leafNode,
  updateLeafNode,
}: SelectedReferencePanelProps) {
  const setSelectedLeafNodeId = useFlowStore(
    (state) => state.setSelectedLeafNodeId
  );

  const onUpdateLabel = (label: string) => {
    updateLeafNode({
      ...leafNode,
      label,
    });
  };

  const onUpdateBindId = (bindId: string) => {
    updateLeafNode({
      ...leafNode,
      bindId,
    });
  };

  return (
    <Box>
      <Box
        sx={{
          background: 'rgb(240,240,240)',
          cursor: 'pointer',
          padding: '7px',
          borderBottom: '1px solid rgb(230,230,230)',
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={() => setSelectedLeafNodeId(null)}
        >
          {'< Back'}
        </Button>
        {/* {'< Back'} */}
      </Box>

      <PanelWrapper label={leafNode.id}>
        <PanelLabel label="Node Type" />
        <Box sx={{ color: 'secondary.main' }}>{'True/False'}</Box>

        <PanelNodeLabel node={leafNode} onUpdateLabelOverride={onUpdateLabel} />

        <PanelNodeId node={leafNode} onUpdateBindIdOverride={onUpdateBindId} />
      </PanelWrapper>
    </Box>
  );
}
