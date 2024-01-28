import Box from '@mui/material/Box';
import { IEmitDataStep, TernaryEnum } from '@cqlab/cqflow-core';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';

type HookStepProps = {
  step: IEmitDataStep;
  stepIndex: number;
};

export function EmitDataStepView({ step, stepIndex }: HookStepProps) {
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
    <InteractiveStepWrapper
      stepIndex={stepIndex}
      panelBackgroundColor={'#E3F2FD'}
      panelTextColor={'rgb(1, 67, 97)'}
      extraDataLabel="Data"
      extraData={extraData}
    >
      <Box sx={{ fontSize: '15px' }}>{step.label}</Box>
    </InteractiveStepWrapper>
  );
}
