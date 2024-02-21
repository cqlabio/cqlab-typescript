import { useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import {
  Handle,
  Position,
  NodeResizeControl,
  useStore,
  NodeProps,
} from 'reactflow';
import { NextPicker } from './next-picker';
import { IFlowDefinitionNode, IStartNode } from '@cqlab/cqflow-core';
// import { useFlowStore } from '../../../../../../apps/cqflow-frontend/src/flow-designer/flow-store';
import { FlowDiagramContext } from '../../flow-diagram-context';

import { FlowNodeData, ValidationEnum } from '../../convert-nodes-and-edges';
import { handleStyle } from './handle-style';
import { getNodeColorLight } from '../../colors';

// import { ReactFlowNode, FlowNodeTypeEnum } from '@cqlabio/shared/types';
// import { useGetDecisionFlowVersionByIdQuery } from '@cqworkspace/data/services/decisionFlow';
// import { StartF./lowNode } from './flowNodeTypes'

// type InputNodeProps = NodeProps<FlowNodeData<IStartNode>>

type CircleDiagramNodeProps = {
  node: IFlowDefinitionNode;
  label: string;
  validationStatus?: ValidationEnum;
  displayDropBox?: boolean;
};

const BORDER_RADIUS = '40px';

export const CircleDiagramNode = ({
  node,
  label,
  validationStatus,
  displayDropBox,
}: CircleDiagramNodeProps) => {
  // const connectionNodeId = useStore((state) => state.connectionNodeId);

  // const selectedNodeId = useFlowStore((state) => state.selectedNodeId);
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const { selectedNodeId, creatingEdge } = useContext(FlowDiagramContext);

  const isSelected = selectedNodeId === node.id;
  const isTarget = connectionNodeId && connectionNodeId !== node.id;
  const isConnectableStart = creatingEdge?.sourceId === node.id;

  // const showDropBox = displayDropBox && isTarget;

  // console.log('aslkjjahsdal 2', connectionNodeId)

  return (
    <Paper
      elevation={0}
      sx={{
        textAlign: 'center',
        borderRadius: BORDER_RADIUS,
        width: '60px',
        height: '60px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        border: `1px solid ${getNodeColorLight(node.nodeType)}`,
        boxShadow: isSelected ? `0 1px 8px -2px rgb(60,60,60)` : 'inehrit',
      }}
    >
      <Box sx={{ flexGrow: 1, color: 'rgb(100,100,100)', fontWeight: '300' }}>
        <Handle
          id="top"
          type="source"
          position={Position.Top}
          isConnectable={true}
          style={{
            ...handleStyle,
            top: '-6px',
            opacity: isConnectableStart || isTarget ? 1 : 0,
          }}
        />

        <Handle
          id="bottom"
          type="source"
          position={Position.Bottom}
          isConnectable={true}
          style={{
            ...handleStyle,
            bottom: '-6px',
            opacity: isConnectableStart || isTarget ? 1 : 0,
          }}
        />

        <Handle
          id="right"
          type="source"
          position={Position.Right}
          isConnectable={true}
          style={{
            ...handleStyle,
            right: '-6px',
            opacity: isConnectableStart || isTarget ? 1 : 0,
          }}
        />

        <Handle
          id="left"
          type="source"
          position={Position.Left}
          isConnectable={true}
          style={{
            ...handleStyle,
            left: '-6px',
            opacity: isConnectableStart || isTarget ? 1 : 0,
          }}
        />
        {/* <Box
          sx={{
            // position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            border: showDropBox ? '2px dashed #5E4A06' : 0,
            background: 'rgba(255,250,234, 0.2)',
            borderRadius: BORDER_RADIUS,
            // width: !isSelected ? 0 : 'default',
            width: showDropBox ? 'default' : 0,
            height: showDropBox ? 'default' : 0,
          }}
        >
          <Handle
            type="source"
            id="bottom"
            position={Position.Bottom}
            style={{
              background: 'inehrit',
              // opacity: 0,
            }}
            onConnect={(params) => console.log('handle onConnect blam', params)}
            isConnectable={true}
          />



        </Box> */}
        {label}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '-20px',
          right: '-90px',
          // transform: 'rotate(315deg)',
        }}
      >
        <NextPicker
          isSelected={isSelected && !isConnectableStart}
          sourceId={node.id}
        />
      </Box>

      {validationStatus === ValidationEnum.VALID && (
        <Box
          sx={{
            position: 'absolute',
            borderRadius: BORDER_RADIUS,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(129,199,132, 0.1)',
            border: '1px solid rgb(129,199,132)',
          }}
        />
      )}

      {validationStatus === ValidationEnum.INVALID && (
        <Box
          sx={{
            position: 'absolute',
            borderRadius: BORDER_RADIUS,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(229,115,115, 0.1)',
            border: '1px solid rgb(229,115,115)',
          }}
        />
      )}
    </Paper>
  );
};
