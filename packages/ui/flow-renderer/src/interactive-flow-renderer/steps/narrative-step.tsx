import Box from '@mui/material/Box';
import { INarrativeStep, TernaryEnum } from '@cqlab/cqflow-core';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';

type NarrativeStepProps = {
  step: INarrativeStep;
  stepIndex: number;
};

export function NarrativeStepView({ step, stepIndex }: NarrativeStepProps) {
  // const value =
  // typeof execAnswer?.answer === 'boolean'
  //   ? execAnswer?.answer
  //     ? 'yes'
  //     : 'no'
  //   : null;

  return (
    <InteractiveStepWrapper
      panelBackgroundColor={'#E0F7FA'}
      stepIndex={stepIndex}
    >
      <Box sx={{ fontSize: '15px' }}>
        <Box
          sx={{
            textTransform: 'uppercase',
            fontSize: '13px',
            color: '#006064',
            paddingBottom: '2px',
          }}
        >
          Narrative
        </Box>
        {step.narrative}
      </Box>
    </InteractiveStepWrapper>
  );
}
