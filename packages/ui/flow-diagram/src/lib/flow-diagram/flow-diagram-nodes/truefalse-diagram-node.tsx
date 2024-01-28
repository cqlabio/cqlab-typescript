import React, { memo, useContext, LegacyRef } from 'react';
// import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {
  NodeResizeControl,
  Handle,
  Position,
  useStore,
  useStoreApi,
  NodeProps,
} from 'reactflow';
// import { getNodeColor } from '../../colors';
import BackHandIcon from '@mui/icons-material/BackHand';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
// import { Resizable } from 'react-resizable';
// import ResizableDiv from './RectangleDiagramNode'
import RectangleDiagramNode from './common/rectangle-node';
// import { CqlFlowNode } from '@cqlabio/shared/types';
// import { ReactFlowNode, FlowNodeTypeEnum } from '@cqlabio/shared/types';
// import { FlowContext } from '../../flow-context';
// import { useFlowStore } from '../../../../../apps/cqflow-frontend/src/flow-designer/flow-store';
import { ITrueFalseNode } from '@cqlab/cqflow-core';
import { TrueFalsePicker } from './common/true-false-picker';
import { FlowDiagramContext } from '../flow-diagram-context';
import { FlowNodeData, ValidationEnum } from '../convert-nodes-and-edges';
import { handleStyle } from './common/handle-style';
import { getNodeColor, getNodeColorLight } from '../colors';

// type CQLNodeProps = {
//   data: ITrueFalseNode;
//   isConnectable: boolean;
// };

function ResizeIcon() {
  return (
    <svg
      className="resize-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="rgba(100,100,100, 0.5)"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: '8px', bottom: '0px' }}
      transform="rotate(-45 0 0)"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}

type InputNodeProps = NodeProps<FlowNodeData<ITrueFalseNode>>;

export const TrueFalseDiagramNode = memo(({ data }: InputNodeProps) => {
  const { node, editMode, validationStatus } = data;

  const { selectedNodeId } = useContext(FlowDiagramContext);

  const connectionNodeId = useStore((state) => state.connectionNodeId);

  // const isConnecting = !!connectionNodeId;

  const isTarget = connectionNodeId && connectionNodeId !== node.id;
  // const label = isTarget ? 'Drop here' : 'Drag to connect';

  // const selectedNodeId = useFlowStore((state) => state.selectedNodeId);

  const reactFlowStore = useStoreApi();

  const isSelected = selectedNodeId === node.id;

  const clickOnTrue = () => {
    console.log({
      nodeId: node.id,
      type: 'target',
      handleId: 'hello',
    });

    reactFlowStore.setState({
      connectionNodeId: node.id,
      connectionStartHandle: {
        nodeId: node.id,
        type: 'source',
        handleId: 'hello',
      },
    });

    // console.log('clickOnTrue', edges);

    // setEdges([
    //   ...edges,
    //   {
    //     id: 'something',
    //     source: "start_bwvtytlg",
    //    type: 'smoothstep',
    //    target: 'exec_wcfcllpa'
    //   }
    // ])
  };

  // const isImplemented = !!flowImplementation?.nodeBindings[node.id];

  const nodeColor = getNodeColor(node.nodeType);

  return (
    <Box
      className={`node-${node.id}`}
      sx={{
        height: '100%',
        fontSize: '14px',
        fontWeight: 300,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        '.resize-icon': {
          display: 'none',
        },
        ':hover': {
          '.resize-icon': {
            display: 'inherit',
          },
        },
      }}
    >
      <Box
        sx={{
          // color: 'rgb(200,200,200)',
          color: nodeColor,
          fontWeight: 'bold',
          zIndex: 1,
          textAlign: 'center',
          position: 'absolute',
          top: '-5px',
          right: 0,
          left: 0,
        }}
      >
        T/F
      </Box>

      <Box sx={{ zIndex: 1, textAlign: 'center', flexGrow: 1, padding: '3px' }}>
        {node.label}
      </Box>

      <Paper
        elevation={0}
        sx={{
          padding: '0',
          position: 'absolute',
          transform: 'rotate(45deg)',
          zIndex: 0,
          width: '100%',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100%',
          border: `1px solid ${getNodeColorLight(node.nodeType)}`,

          boxShadow: isSelected ? `0 1px 8px -2px ${nodeColor}` : 'inehrit',

          '.resize-icon': {
            display: 'none',
          },
          ':hover': {
            '.resize-icon': {
              display: 'inherit',
            },
          },
          // opacity: 0.5
        }}
      >
        <Handle
          id="top"
          type="source"
          position={Position.Top}
          isConnectable={true}
          style={{
            ...handleStyle,
            position: 'absolute',
            left: '2px',
            // top: '-100px'
            opacity: isTarget ? 1 : 0,
          }}
        />

        <Handle
          id="bottom"
          type="source"
          position={Position.Bottom}
          isConnectable={true}
          style={{
            ...handleStyle,
            opacity: isTarget ? 1 : 0,
            position: 'absolute',
            top: 'reset',
            bottom: '-6px',

            right: '2px',
            left: '100%',
          }}
        />

        <Handle
          id="right"
          type="source"
          position={Position.Right}
          isConnectable={true}
          style={{
            ...handleStyle,
            opacity: isTarget ? 1 : 0,

            position: 'absolute',
            top: 0,
            right: '-6px',
          }}
        />

        <Handle
          id="left"
          type="source"
          position={Position.Left}
          isConnectable={true}
          style={{
            ...handleStyle,
            opacity: isTarget ? 1 : 0,

            position: 'absolute',
            bottom: '-12px',
            right: 'auto',
            top: 'auto',
            left: '-6px',
            // border: 0
            // right: 0,
          }}
        />

        {/* <Box
          sx={{
            display: isTarget ? 'inherit' : 'none',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            border: '2px dashed #5E4A06',
            // background: '#FFFAEA',
            background: 'rgba(255,250,234, 0.2)',
          }}
        /> */}

        {validationStatus === ValidationEnum.VALID && (
          <Box
            sx={{
              // display: isTarget ? 'inherit' : 'none',
              position: 'absolute',
              left: 0,
              top: 0,
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
              // display: isTarget ? 'inherit' : 'none',
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(229,115,115, 0.1)',
              border: '1px solid rgb(229,115,115)',
            }}
          />
        )}

        <Box
          sx={{
            // background: 'rgb(230,230,230)',
            position: 'absolute',
            bottom: '0px',
            right: '-100px',
            transform: 'rotate(315deg)',
          }}
        >
          <TrueFalsePicker isSelected={isSelected} />
        </Box>

        {editMode && (
          <NodeResizeControl
            style={{
              background: 'transparent',
              border: 'none',
            }}
            minWidth={100}
            minHeight={100}
            keepAspectRatio
          >
            <ResizeIcon />
          </NodeResizeControl>
        )}
      </Paper>
    </Box>
  );

  // return (
  //   <RectangleDiagramNode
  //     title="Evaluate"
  //     color="#1976D2"
  //     isConnectable={isConnectable}
  //     footerHandles={footerHandles}
  //     reactFlowNode={data}
  //     notValid={!isImplemented}
  //   >
  //     {/* {JSON.stringify(data, null, 2)} */}
  //     <Box sx={{ textAlign: 'center' }}>{data.label}</Box>
  //   </RectangleDiagramNode>
  // );
});
