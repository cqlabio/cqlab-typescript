import Box from '@mui/material/Box';
import { IExecStep, TernaryEnum } from '@cqlab/cqflow-core';
import { StepWrapper, EdgeEnum } from './common/step-wrapper';

type ExecStepExplanationProps = {
  step: IExecStep;
  stepIndex: number;
};

export default function ExecStepExplanation({
  step,
  stepIndex,
}: ExecStepExplanationProps) {
  const extraData = step.supplementalData && (
    <Box
      component="pre"
      sx={{ padding: '5px', margin: 0, background: 'rgb(255,255,255)' }}
    >
      {JSON.stringify(step.supplementalData, null, 2)}
    </Box>
  );

  return (
    <StepWrapper
      title="Evaluate"
      stepIndex={stepIndex}
      color="#1976D2"
      edge={step.evaluation === TernaryEnum.TRUE ? EdgeEnum.Yes : EdgeEnum.No}
      extraDataLabel="Supplemental Data"
      extraData={extraData}
    >
      {step.label}
    </StepWrapper>
  );
}
