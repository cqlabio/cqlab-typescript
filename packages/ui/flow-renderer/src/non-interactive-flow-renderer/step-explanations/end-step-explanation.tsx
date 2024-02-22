import { IEndStep } from '@cqlab/cqflow-core';
import { StepWrapper, EdgeEnum } from './common/step-wrapper';

type EndExplanationProps = {
  step: IEndStep;
  stepIndex: number;
};

export function EndExplanation({ step, stepIndex }: EndExplanationProps) {
  return (
    <StepWrapper
      title="End"
      color="rgb(190,190,190)"
      labelColor="rgb(130,130,130)"
      stepIndex={stepIndex}
    >
      Complete
    </StepWrapper>
  );
}
