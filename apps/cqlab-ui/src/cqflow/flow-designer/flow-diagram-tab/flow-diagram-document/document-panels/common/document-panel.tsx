import { CSSProperties, FC, memo, ReactNode, useCallback } from 'react';

import Box from '@mui/material/Box';
import { IFlowDefinitionNode } from '@cqlab/cqflow-core';
import { getNodeColor } from '@cqlab/ui-flow-diagram';
export interface CardProps {
  children: ReactNode;
  panelNumber?: number;
  node: IFlowDefinitionNode;
}

export const DocumentPanel = memo(function Card({
  panelNumber,
  children,
  node,
}: CardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        borderBottom: '1px solid rgb(230,230,230)',
      }}
    >
      <Box
        sx={{
          background: '#FFFAEB',
          // background: 'rgb(250,250,250)',
          cursor: 'move',
          borderRight: '1px solid rgb(230,230,230)',
          display: 'flex',
          color: 'rgb(100,100,100)',
          fontSize: 14,
          minWidth: '25px',
          textAlign: 'center',
          flexDirection: 'column',
        }}
      >
        {Number.isInteger(panelNumber) && (
          <Box
            sx={{
              color: '#AE9542',
              borderBottom: '1px solid rgb(230,230,230)',
            }}
          >
            {panelNumber}
          </Box>
        )}
      </Box>
      <Box
        sx={{ flexGrow: 1, fontSize: '15px', padding: '0px 10px 10px 10px' }}
      >
        <Box
          sx={{
            padding: '5px 0',
            fontWeight: 300,
            fontSize: '14px',
            color: getNodeColor(node.nodeType),
          }}
        >
          {node.nodeType}
        </Box>
        {children}
      </Box>
    </Box>
  );
});
