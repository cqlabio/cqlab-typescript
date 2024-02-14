// import { useState, useEffect, useMemo } from 'react';
// import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import Box from '@mui/material/Box';
import { EditableTextRow } from '../../common/editable-text-row';
import { IBranchNode, INextMultiOption } from '@cqlab/cqflow-core';
import { NextNode } from '../../common/next-node';
import { FlowDesignerContext } from '../../../../flow-designer-context';
import { useContext } from 'react';

// import {
//   DecisionFlowNodeWithNode,
//   UserDecisionFlowNode,
//   // UserNodeChoice,
//   UserDecisionPanelOption,
// } from '@cqlabio/shared/types';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

type EditUserDecisionFlowNodeProps = {
  node: IBranchNode;
  option: INextMultiOption;
  choiceIndex: number;
  // onUpdateNode: (node: DecisionFlowNodeWithNode) => void;
  // onUpdateNode: (node: DecisionFlowNodeWithNode) => void
};

export function BranchChoicePanelEditChoice({
  option,
  choiceIndex,
  node,
}: // userFlowNode,
// onUpdateNode,
EditUserDecisionFlowNodeProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  // const doNodeUpdates = useFlowStore((state) => state.doNodeUpdates);

  const onUpdateLabel = (nextLabel: string) => {
    // This can't happen for this to render
    if (!node.next) {
      return;
    }

    const nextOptions = cloneDeep(node.next.options);

    nextOptions[choiceIndex] = {
      ...nextOptions[choiceIndex],
      label: nextLabel,
    };

    doNodeUpdates({
      op: 'update',
      node: {
        ...node,
        next: {
          ...node.next,
          options: nextOptions,
        },
      },
    });
  };

  const onClearNext = () => {
    // This can't happen for this to render
    if (!node.next) {
      return;
    }

    const nextOptions = cloneDeep(node.next.options);

    nextOptions[choiceIndex] = {
      ...nextOptions[choiceIndex],
      toId: '',
    };

    doNodeUpdates({
      op: 'update',
      node: {
        ...node,
        next: {
          ...node.next,
          options: nextOptions,
        },
      },
    });
  };

  // const currentOption = userFlowNode.node.options[choiceIndex];

  const onDeleteOption = () => {
    if (!node.next) {
      return;
    }

    const nextOptions = cloneDeep(node.next.options);

    nextOptions.splice(choiceIndex, 1);

    doNodeUpdates({
      op: 'update',
      node: {
        ...node,
        next: {
          ...node.next,
          options: nextOptions,
        },
      },
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box>{alphabet[choiceIndex]})</Box>
      <Box sx={{ paddingLeft: '5px', flexGrow: 1 }}>
        <EditableTextRow
          value={option.label || ''}
          onSaveValue={onUpdateLabel}
          onDelete={onDeleteOption}
        />

        <NextNode nextId={option.toId} onClear={onClearNext} />
      </Box>
    </Box>
  );
}
