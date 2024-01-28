import { WhatIsPriorAuth } from './steps/what-is-prior-auth';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { useState } from 'react';
// import Typography from '@mui/material/Typography';
import { PriorAuthSpec } from './steps/prior-auth-spec';
import { PriorAuthNav } from './prior-auth-nav';
import { MakingAPriorAuthRequest } from './steps/making-a-request';
import { FillingOutTheFormManually } from './steps/filling-out-form-manually';
import { FillingOutTheFormAutoMatically } from './steps/filling-out-form-automatically';
import { ReviewRequest } from './steps/review-of-request';
import { PriorAuthSummary } from './steps/summary';

const steps = [
  {
    label: 'Quick Introduction to Prior Auth',
    description: <WhatIsPriorAuth />,
  },
  {
    label: 'Creating a Prior Auth Specification',
    description: <PriorAuthSpec />,
  },
  {
    label: 'Initiating a Request',
    description: <MakingAPriorAuthRequest />,
  },
  {
    label: 'Manually Filling out the Prior Auth Request Form',
    description: <FillingOutTheFormManually />,
  },
  {
    label: 'Automatically Filling out the Prior Auth Request Form',
    description: <FillingOutTheFormAutoMatically />,
  },
  {
    label: 'Final Review of the Prior Auth Request Form',
    description: <ReviewRequest />,
  },
  {
    label: 'Summary',
    description: <PriorAuthSummary />,
  },
];

export function PriorAuthDemo() {
  const [activeStep, setActiveStep] = useState(1);

  const onNextStep = () => {
    if (activeStep === steps.length - 1) {
      return;
    }
    setActiveStep(activeStep + 1);
  };

  const onPreviousStep = () => {
    if (activeStep === 0) {
      return;
    }
    setActiveStep(activeStep - 1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        height: 'calc(100vh - 53px)',
        width: '100%',
      }}
    >
      <Paper
        square
        sx={{
          display: 'flex',
          width: '300px',
          minWidth: '300px',
          background: 'white',
        }}
      >
        <PriorAuthNav
          stepNames={steps.map((step) => step.label)}
          onSelectStep={(index) => setActiveStep(index)}
          activeStep={activeStep}
        />
      </Paper>

      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          width: `100%`,
          // padding: '30px',
          // overflowY: 'scroll',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            alignItems: 'flex-start',
            padding: '30px',
            overflowY: 'scroll',
          }}
        >
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{ width: '100%' }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  onClick={() => setActiveStep(index)}
                  // optional={
                  //   index === 2 ? (
                  //     <Typography variant="caption">Last step</Typography>
                  //   ) : null
                  // }
                >
                  {step.label}
                </StepLabel>
                <StepContent>{step.description}</StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Paper
          square
          sx={{ padding: '10px', display: 'flex', alignItems: 'center' }}
        >
          <Button
            onClick={onPreviousStep}
            variant="contained"
            size="small"
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          <Box sx={{ padding: '0 30px' }}>
            {activeStep + 1} of {steps.length}
          </Box>
          <Button
            onClick={onNextStep}
            variant="contained"
            size="small"
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
