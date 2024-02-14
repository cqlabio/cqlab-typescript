import { INarrativeStep } from '@cqlab/cqflow-core';
import { StepWrapper, EdgeEnum } from './common/step-wrapper';

type NarrativeExplanationProps = {
  step: INarrativeStep;
  stepIndex: number;
};

export function NarrativeExplanation({
  step,
  stepIndex,
}: NarrativeExplanationProps) {
  return (
    <StepWrapper
      title="Narrative"
      stepIndex={stepIndex}
      color="rgb(190,190,190)"
      labelColor="rgb(130,130,130)"
      edge={EdgeEnum.Next}
    >
      {step.narrative}
    </StepWrapper>
  );
}
