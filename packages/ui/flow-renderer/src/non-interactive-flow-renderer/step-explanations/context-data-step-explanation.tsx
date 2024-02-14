import { IEmitDataStep, TernaryEnum } from '@cqlab/cqflow-core';
import { StepWrapper, EdgeEnum } from './common/step-wrapper';
import Box from '@mui/material/Box';

type EmitDataStepExplanationProps = {
  step: IEmitDataStep;
  highlight?: boolean;
  stepIndex: number;
};

export function EmitDataStepExplanation({
  step,
  highlight,
  stepIndex,
}: EmitDataStepExplanationProps) {
  const extraData = (
    <Box
      component="pre"
      sx={{
        padding: '5px',
        margin: 0,
        background: 'rgb(255,255,255)',
        overflowX: 'scroll',
      }}
    >
      {JSON.stringify(step.contextData, null, 2)}
    </Box>
  );

  return (
    <StepWrapper
      title="Emit Data"
      color="#D0A000"
      edge={EdgeEnum.Next}
      extraDataLabel="Data"
      extraData={extraData}
      stepIndex={stepIndex}
      // highlightColor={highlight ? '#FFECB3' : undefined}
      highlightColor="#E3F2FD"
    >
      {step.label}

      {/* <Box
        sx={{
          fontSize: '12px',
          padding: '3px 0px',
          // border: `0.5px solid ${color}`,
          borderTop: 0,
          color: 'rgb(150,150,150)',
          cursor: 'pointer',
          //  background: 'rgb(245,245,245)'
        }}
      >
        + View Context Data
      </Box> */}
    </StepWrapper>
  );
}
