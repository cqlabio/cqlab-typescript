import { IStartStep, TernaryEnum } from '@cqlab/cqflow-core';
import { StepWrapper, EdgeEnum } from './common/step-wrapper';
import Box from '@mui/material/Box';

type StartExplanationProps = {
  step: IStartStep;
  stepIndex: number;
};

export function StartExplanation({ step, stepIndex }: StartExplanationProps) {
  const extraData = step.initialData && (
    <Box
      component="pre"
      sx={{ padding: '5px', margin: 0, background: 'rgb(255,255,255)' }}
    >
      {JSON.stringify(step.initialData, null, 2)}
    </Box>
  );

  return (
    <StepWrapper
      title="Start"
      stepIndex={stepIndex}
      color="rgb(190,190,190)"
      labelColor="rgb(130,130,130)"
      edge={EdgeEnum.Next}
      extraDataLabel="Launch Data"
      extraData={extraData}
    >
      Start
    </StepWrapper>
  );
}
