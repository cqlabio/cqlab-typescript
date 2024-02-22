import Box from '@mui/material/Box';
import { useContext } from 'react';
import { LinkPassFailSection } from '../../common/link-pass-fail-section';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';
import { PanelLabel } from '../../common/panel-label';
import { PanelNodeLabel } from '../../common/panel-node-label';
import { PanelNodeId } from '../../common/panel-node-id';
import { PanelWrapper } from '../../common/panel-wrapper';
import { SliderPanel } from '../../common/slider-panel';
import {
  BooleanNodeEdit,
  UpdateLogicTreeNode,
} from './logic-tree/boolean-node';
import { useFlowStore, NodeOp } from '../../../../../flow-store';
import { SelectedTrueFalseLeafPanel } from './selected-truefalse-leaf-panel';
import { FlowDesignerContext } from '../../../../flow-designer-context';
import {
  ILogicTreeNode,
  ITrueFalseLeaf,
  ILogic,
  ILogicLeaf,
  LogicEnum,
} from '@cqlab/cqflow-core';
import {
  findLeafNodeInLogicTree,
  updateLeafNodeInLogicTree,
} from './tree-panel-utils';

type LogicTreePanelProps = {
  node: ILogicTreeNode;
};

export function LogicTreePanel({ node }: LogicTreePanelProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);
  const selectedLeafNodeId = useFlowStore((state) => state.selectedLeafNodeId);

  const updateLogicTreeNode: UpdateLogicTreeNode = (nextLogic, extraOps) => {
    const nextUpdates: NodeOp[] = [
      {
        op: 'update',
        node: {
          ...node,
          logicTree: nextLogic as ILogic,
        },
      },
    ];

    doNodeUpdates(nextUpdates);
  };

  const onSelectConstraint = (constraintId: string) => {
    console.log('sr');
  };

  const onUpdateLeafNode = (leafNode: ITrueFalseLeaf) => {
    if (!node.logicTree) {
      return;
    }

    const nextLogicTree = updateLeafNodeInLogicTree(node.logicTree, leafNode);
    updateLogicTreeNode(nextLogicTree, null);
  };

  const leftPanelContent = (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Logic Tree" nodeId={node.id} />

      <PanelNodeLabel node={node} />

      <PanelNodeId node={node} />

      <PanelLabel label="Logic Tree" />
      {node.logicTree ? (
        <BooleanNodeEdit
          node={node.logicTree}
          isRoot
          updateLogicTreeNode={updateLogicTreeNode}
          onSelectConstraint={onSelectConstraint}
        />
      ) : (
        <Box>No Query</Box>
      )}

      <LinkPassFailSection node={node} />
    </PanelWrapper>
  );

  const leafNode = findLeafNodeInLogicTree(node.logicTree, selectedLeafNodeId);

  const rightPanelContent = leafNode && (
    <SelectedTrueFalseLeafPanel
      leafNode={leafNode}
      updateLeafNode={onUpdateLeafNode}
    />
  );

  return (
    <SliderPanel
      slideRight={!!leafNode}
      leftPanelContent={leftPanelContent}
      rightPanelContent={rightPanelContent}
    />
  );
}
