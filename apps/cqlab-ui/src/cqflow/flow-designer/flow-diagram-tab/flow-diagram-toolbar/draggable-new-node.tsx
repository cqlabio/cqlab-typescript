import { useDrag } from 'react-dnd';
import Box from '@mui/material/Box';
import { DefinitionNodeTypeEnum } from '@cqlab/cqflow-core';
import { getNodeColor, getNodeColorLight } from '@cqlab/ui-flow-diagram';
import { DragIconShape } from './shape';

export const NEW_FLOW_NODE = 'NEW_FLOW_NODE';

export type NewFlowNode = {
  dragType: 'NEW_FLOW_NODE';
  flowNodeType: DefinitionNodeTypeEnum;
};

type NewFlowNodeProps = {
  label: string;
  flowNodeType: DefinitionNodeTypeEnum;
  isDisabled?: boolean;
};

export function DraggableNewNode({
  label,
  flowNodeType,
  isDisabled,
}: NewFlowNodeProps) {
  const [{ isDragging, canDrag }, drag, preview] = useDrag(
    () => ({
      type: NEW_FLOW_NODE,
      canDrag: !isDisabled,
      item: {
        dragType: NEW_FLOW_NODE,
        flowNodeType: flowNodeType,
      } as NewFlowNode,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag(),
        // monitor.
      }),
    }),
    [flowNodeType, isDisabled]
  );

  return (
    <Box
      sx={{
        width: 'calc(50% - 5px)',
      }}
    >
      <Box
        ref={drag}
        sx={{
          padding: '5px 2px',
          cursor: `grab`,
          fontSize: '13px',
          alignItems: 'center',
          borderRadius: '4px',
          color: isDisabled ? 'rgb(200,200,200)' : getNodeColor(flowNodeType),
          display: 'flex',
          border: '1px solid white',

          ':hover': isDisabled
            ? undefined
            : {
                boxShadow: `0 1px 3px 0px ${getNodeColorLight(flowNodeType)}`,
                color: getNodeColor(flowNodeType),
                border: `1px solid ${getNodeColorLight(flowNodeType)}`,
              },
        }}
      >
        <Box>
          <DragIconShape nodeType={flowNodeType} isDisabled={isDisabled} />
        </Box>
        <Box
          sx={{
            fontFamily: 'Nunito',
            flexGrow: 1,
            whiteSpace: 'nowrap',
            overflowX: 'hidden',
            fontWeight: 500,
          }}
        >
          {label}
        </Box>
      </Box>
    </Box>
  );
}
