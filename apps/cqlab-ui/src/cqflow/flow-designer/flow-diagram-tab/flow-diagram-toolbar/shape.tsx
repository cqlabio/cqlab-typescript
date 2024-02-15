import { DefinitionNodeTypeEnum } from '@cqlab/cqflow-core';
import { getNodeColor, getNodeColorLight } from '@cqlab/ui-flow-diagram';
import Box from '@mui/material/Box';

type DragIconShapeProps = {
  nodeType: DefinitionNodeTypeEnum;
  isDisabled?: boolean;
};

export function DragIconShape({ nodeType, isDisabled }: DragIconShapeProps) {
  const color = isDisabled ? 'rgb(200,200,200)' : getNodeColor(nodeType);
  if (
    nodeType === DefinitionNodeTypeEnum.Start ||
    nodeType === DefinitionNodeTypeEnum.End
  ) {
    return (
      <Box
        sx={{
          border: `1px solid ${color}`,
          opacity: 0.5,
          width: '15px',
          height: '15px',
          marginRight: '7px',
          borderRadius: '13px',
        }}
      />
    );
  } else if (nodeType === DefinitionNodeTypeEnum.TrueFalse) {
    return (
      <Box
        sx={{
          border: `1px solid ${color}`,
          opacity: 0.5,
          width: '13px',
          height: '13px',
          marginLeft: '2px',
          marginRight: '7px',
          transform: 'rotate(45deg)',
          // borderRadius: '13px',
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        border: `1px solid ${color}`,
        opacity: 0.5,
        width: '16px',
        marginLeft: '1px',
        height: '13px',
        marginRight: '5px',
        borderRadius: '2  px',
      }}
    />
  );
}
