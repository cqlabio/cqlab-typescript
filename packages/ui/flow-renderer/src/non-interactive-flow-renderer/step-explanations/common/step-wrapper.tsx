import { ReactNode, useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export enum EdgeEnum {
  No = 'No',
  Yes = 'Yes',
  Next = 'Next',
}

type StepWrapperProps = {
  title: string;
  color: string;
  children: ReactNode;
  edge?: EdgeEnum;
  labelColor?: string;
  extraDataLabel?: string;
  extraData?: ReactNode;
  highlightColor?: string;
  stepIndex: number;
};

export const StepWrapper = ({
  title,
  color,
  children,
  edge,
  labelColor,
  extraDataLabel,
  extraData,
  highlightColor,
  stepIndex,
}: StepWrapperProps) => {
  const [showExtraData, setShowExtraData] = useState(false);

  const toggleExtraData = () => setShowExtraData(!showExtraData);

  let edgeView: ReactNode = null;

  if (edge === EdgeEnum.No) {
    edgeView = (
      <Chip
        sx={{ background: 'none', marginRight: '5px' }}
        size="small"
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ color: '#d12733' }}>No</Box>
            <ArrowDownwardIcon sx={{ color: '#d12733', fontSize: '18px' }} />
          </Box>
        }
      />
    );
  } else if (edge === EdgeEnum.Yes) {
    edgeView = (
      <Chip
        sx={{ background: 'none', marginRight: '5px' }}
        size="small"
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ color: 'green' }}>Yes</Box>
            <ArrowDownwardIcon sx={{ color: 'green', fontSize: '18px' }} />
          </Box>
        }
      />
    );
  } else if (edge === EdgeEnum.Next) {
    edgeView = (
      <Chip
        sx={{ background: 'none', marginRight: '5px' }}
        size="small"
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ color: 'rgb(140,140,140)' }}>Next</Box>
            <ArrowDownwardIcon
              sx={{ color: 'rgb(130,130,130)', fontSize: '18px' }}
            />
          </Box>
        }
      />
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '600px',
        margin: '0 auto',
        marginBottom: '15px',
      }}
    >
      {/* <Box
        sx={{
          left: 0,
          fontSize: '12px',
          marginBottom: '1px',
          color: labelColor || color,
        }}
      >
        {title}
      </Box> */}

      <Box
        sx={{
          left: 0,
          fontSize: '12px',
          marginBottom: '3px',
          textTransform: 'uppercase',
          color: 'rgb(150,150,150)',
          // color: labelColor || color,
        }}
      >
        Step {stepIndex + 1}
      </Box>

      <Paper
        // square
        elevation={1}
        sx={{
          // border: `0.5px solid ${color}`,
          fontWeight: 300,
          background: highlightColor || undefined,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ padding: '10px 0 10px 10px', flexGrow: 1 }}>
            {children}
          </Box>
          {edgeView && (
            <Box
              sx={{
                padding: '10px 0 10px 0',
                // display: 'inline-flex',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {edgeView}
            </Box>
          )}
        </Box>
        {showExtraData && (
          <Box sx={{ borderTop: '1px solid rgb(230,230,230)' }}>
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
            padding: '3px 0px 0 0',
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
};
