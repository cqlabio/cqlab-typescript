import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

type InteractiveStepWrapperProps = {
  stepIndex: number;
  children: React.ReactNode;
  panelBackgroundColor?: string;
  panelTextColor?: string;
  topRightLabel?: ReactNode;
  extraDataLabel?: string;
  extraData?: ReactNode;
};

export function InteractiveStepWrapper({
  stepIndex,
  children,
  panelBackgroundColor,
  panelTextColor,
  topRightLabel,
  extraDataLabel,
  extraData,
}: InteractiveStepWrapperProps) {
  const [showExtraData, setShowExtraData] = useState(false);

  const toggleExtraData = () => setShowExtraData(!showExtraData);
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          marginTop: '17px',
          marginBottom: '3px',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            paddingLeft: '24px',
            color: 'rgb(100,100,100)',
            fontWeight: 300,

            textTransform: 'uppercase',
            fontSize: '13px',
          }}
        >
          Step {stepIndex}
        </Box>
        <Box sx={{ paddingRight: '24px' }}>{topRightLabel}</Box>
      </Box>
      <Paper
        sx={{
          // marginTop: isLast ? '5px' : 0,
          // background: step.stepType === ImplementationNodeTypeEnum.EmitData ? '#FFECB3': '' ,
          background: panelBackgroundColor,
          color: panelTextColor,
          marginLeft: '20px',
          marginRight: '20px',
          // padding: '15px',
          borderBottom: '1px solid rgba(230,230,230, 0.5)',
        }}
      >
        <Box sx={{ display: 'flex', padding: '15px' }}>
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
        {showExtraData && (
          <Box sx={{ borderTop: '1px solid rgb(230,230,230)', padding: '5px' }}>
            {extraData || (
              <Box sx={{ padding: '5px', color: 'rgb(130,130,130)' }}>
                No Data
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {extraDataLabel && extraData && (
        <Box
          onClick={toggleExtraData}
          sx={{
            fontSize: '12px',
            padding: '5px 0px 0 0',
            paddingLeft: '24px',
            // border: `0.5px solid ${color}`,
            borderTop: 0,
            color: 'rgb(150,150,150)',
            cursor: 'pointer',
            ':hover': {
              color: 'rgb(100,100,100)',
            },
            //  background: 'rgb(245,245,245)'
          }}
        >
          + {extraDataLabel}
        </Box>
      )}
    </Box>
  );
}
