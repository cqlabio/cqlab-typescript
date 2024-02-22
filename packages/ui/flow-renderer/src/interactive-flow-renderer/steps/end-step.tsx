import Box from '@mui/material/Box';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// import { ExecFlowNode } from "../../types/flowNodeTypes";
// import { IYesNoStep, IndexAnswer, TernaryEnum } from "../../types/flowStepTypes";

import { IEndStep } from '@cqlab/cqflow-core';

type EndStepProps = {
  step: IEndStep;
  stepIndex: number;
  // onDeleteAnswer: (stepId: string) => void;
};

export function EndStepView({
  stepIndex,
}: // onDeleteAnswer,
EndStepProps) {
  // const value =

  return (
    <InteractiveStepWrapper stepIndex={stepIndex}>
      <Box sx={{ fontSize: '15px' }}>Complete</Box>
    </InteractiveStepWrapper>
  );
}
