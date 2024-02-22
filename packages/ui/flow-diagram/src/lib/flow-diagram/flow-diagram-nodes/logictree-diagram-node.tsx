import React, { memo, useState, LegacyRef } from 'react';
import Box from '@mui/material/Box';
import RectangleDiagramNode from './common/rectangle-node';
// import { CqlFlowNode } from '@cqlabio/shared/types';
// import { ReactFlowNode, FlowNodeTypeEnum } from '@cqlabio/shared/types';
import LogicTreeInNode from './logic-tree-in-node/LogicTreeInNode';
import { Node } from 'reactflow';
import { ILogicTreeNode } from '@cqlab/cqflow-core';
import { NodeProps } from 'reactflow';
import { FlowNodeData } from '../convert-nodes-and-edges';

// type CQLNodeProps = {
//   data: ILogicTreeNode;
//   isConnectable: boolean;
// };

type InputNodeProps = NodeProps<FlowNodeData<ILogicTreeNode>>;

export const LogicTreeDiagramNode = memo((props: InputNodeProps) => {
  const { node, validationStatus, editMode } = props.data;

  // const footerHandles = [
  //   {
  //     id: 'onFail',
  //     label: 'false',
  //   },
  //   {
  //     id: 'onPass',
  //     label: 'true',
  //   },
  // ];

  return (
    <RectangleDiagramNode
      title="Logic Tree"
      // color="#1976D2"
      // footerHandles={footerHandles}
      flowNode={node}
      validationStatus={validationStatus}
      editMode={editMode}
    >
      <Box sx={{ paddingBottom: '5px' }}>{node.label}</Box>
      <LogicTreeInNode node={node.logicTree || null} />
    </RectangleDiagramNode>
  );
});
