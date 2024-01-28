import { ReactNode, useContext } from 'react';
import { NodeResizeControl, useStore, Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {
  DefinitionNodeTypeEnum,
  IFlowDefinitionNode,
  isBooleanNode,
} from '@cqlab/cqflow-core';

// import { useFlowStore } from '../../../../../../apps/cqflow-frontend/src/flow-designer/flow-store';
import { ValidationEnum } from '../../convert-nodes-and-edges';
import { NextPicker } from './next-picker';
import { TrueFalsePicker } from './true-false-picker';
import { MultiChoicePicker } from './multi-choice-picker';
import { getNodeColor, getNodeColorLight } from '../../colors';
import { FlowDiagramContext } from '../../flow-diagram-context';
import { handleStyle } from './handle-style';

interface FooterHandle {
  id: string;
  label: string;
}

export function ResizeIcon() {
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
      style={{ position: 'absolute', right: '-6px', bottom: '-6px' }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

enum PickerType {
  Unary = 'Unary',
  Binary = 'Binary',
  Multi = 'Multi',
}

type RectangleDiagramNodeProps = {
  title: string;
  color?: string;
  // footerHandles?: FooterHandle[];
  children: ReactNode;
  flowNode: IFlowDefinitionNode;
  validationStatus?: ValidationEnum;
  editMode: boolean;
  backgroundColor?: string;
  border?: string;
};

const RectangleDiagramNode = ({
  title,
  color,
  children,
  // footerHandles,
  flowNode,
  validationStatus,
  editMode,
  backgroundColor,
  border,
}: RectangleDiagramNodeProps) => {
  const connectionNodeId = useStore((state) => state.connectionNodeId);
  const { selectedNodeId } = useContext(FlowDiagramContext);

  const isTarget = connectionNodeId && connectionNodeId !== flowNode.id;
  // const isTarget = false;
  const isSelected = selectedNodeId === flowNode.id;

  // console.log('eerere', connectionNodeId)

  let pickerType = PickerType.Unary;

  if (!flowNode) {
    return <Box>ERROR: NODE NOT FOUND</Box>;
  }

  if (flowNode.nodeType === DefinitionNodeTypeEnum.Branch) {
    pickerType = PickerType.Multi;
  } else if (isBooleanNode(flowNode)) {
    pickerType = PickerType.Binary;
  }

  const nodeColor = color || getNodeColor(flowNode.nodeType);

  return (
    <Paper
      elevation={0}
      // square
      sx={{
        height: '100%',
        borderRadius: '10px',
        position: 'relative',
        cursor: isTarget ? 'crosshair' : 'default',
        padding: '3px 0px 2px 0px',
        fontSize: '12px',
        display: 'flex',
        background: backgroundColor || 'white',
        border: border || `1px solid ${getNodeColorLight(flowNode.nodeType)}`,
        boxShadow: isSelected ? `0 1px 8px -2px ${nodeColor}` : 'inehrit',
        // boxShadow: `0 0 15px 2px ${nodeColor}`,
        flexDirection: 'column',
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
      {/* {flowNode.disabled && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(80,80,80,0.1)',
            }}
          />
        )} */}

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '10px',
          border: '2px dashed #5E4A06',
          background: 'rgba(255,250,234, 0.2)',
          // opacity: 0.2,
          // display: isTarget ? 'inherit' : 'none',
          display: 'none',
          cursor: 'cell',
        }}
      />

      {validationStatus === ValidationEnum.VALID && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '10px',
            background: 'rgba(129,199,132, 0.1)',
            border: '1px solid rgb(129,199,132)',
          }}
        />
      )}

      {validationStatus === ValidationEnum.INVALID && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '10px',
            background: 'rgba(229,115,115, 0.1)',
            border: '1px solid rgb(229,115,115)',
          }}
        />
      )}

      <Box
        sx={{
          // fontWeight: 'bold',
          paddingTop: '2px',
          paddingBottom: '3px',
          // color: color,
          position: 'relative',
          textAlign: 'center',
          fontFamily: 'Red Hat Display var(--cq-title-font)',
          fontWeight: 600,
          // color: 'sec',
        }}
      >
        <Box sx={{ color: nodeColor }}>{title}</Box>
      </Box>

      <Box
        sx={{
          padding: '5px 5px',
          // borderTop: '1px solid rgb(210,210,210)',
          flexGrow: 1,
          overflowY: 'hidden',
        }}
      >
        {children}
      </Box>

      {/* {footerHandles && (
        <Box
          sx={{
            display: 'flex',
            // borderTop: '1px solid rgb(210,210,210)',
            // marginTop: '10px',
            justifyContent: 'space-evenly',
            height: '1px',
            '.react-flow__handle': {
              height: '7px',
              width: '7px',
              borderRadius: 0,
              border: 0,
              bottom: '-6px',
              background: 'rgb(80, 80, 80)',
            },
          }}
        >
          { {footerHandles.map((footerHandle, index) => (
            <Box key={index} sx={{ padding: '0 5px', position: 'relative' }}>


              <Handle
                id={footerHandle.id || index + '_'}
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
              />
            </Box>
          ))} }
        </Box>
      )} */}

      <Handle
        id="top"
        type="source"
        position={Position.Top}
        isConnectable={!!isTarget}
        style={{
          ...handleStyle,
          top: '-6px',
          opacity: isTarget ? 1 : 0,
        }}
      />

      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        isConnectable={!!isTarget}
        style={{
          ...handleStyle,
          bottom: '-6px',
          opacity: isTarget ? 1 : 0,
        }}
      />

      <Handle
        id="right"
        type="source"
        position={Position.Right}
        isConnectable={!!isTarget}
        style={{
          ...handleStyle,
          right: '-6px',
          opacity: isTarget ? 1 : 0,
        }}
      />

      <Handle
        id="left"
        type="source"
        position={Position.Left}
        isConnectable={!!isTarget}
        style={{
          ...handleStyle,
          left: '-6px',
          opacity: isTarget ? 1 : 0,
        }}
      />

      {editMode && (
        <NodeResizeControl style={controlStyle} minWidth={150} minHeight={60}>
          <ResizeIcon />
        </NodeResizeControl>
      )}
      {pickerType === PickerType.Unary && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20px',
            right: '-100px',
          }}
        >
          <NextPicker isSelected={editMode ? isSelected : false} />
        </Box>
      )}
      {pickerType === PickerType.Binary && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '-40px',
            right: '-100px',
          }}
        >
          <TrueFalsePicker isSelected={editMode ? isSelected : false} />
        </Box>
      )}
      {pickerType === PickerType.Multi &&
        flowNode.nodeType === DefinitionNodeTypeEnum.Branch && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '-40px',
              right: '-70px',
            }}
          >
            <MultiChoicePicker
              isSelected={editMode ? isSelected : false}
              next={flowNode.next}
            />
          </Box>
        )}
    </Paper>
  );
};

export default RectangleDiagramNode;
