import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button';
import axios from 'axios';
import { TestCasePanel } from '../launch-interactive/test-case-panel';
import { IFlowDefinition, IFlowStep } from '@cqlab/cqflow-core';
import { useFlowStore } from '../../../flow-store';
import { NonInteractiveStepRenderer } from '@cqlab/ui-flow-renderer';

type CqFlowLaunchOneshotProps = {
  flow: IFlowDefinition;
};

export function CqFlowLaunchOneshot({ flow }: CqFlowLaunchOneshotProps) {
  const [steps, setSteps] = useState<IFlowStep[] | null>(null);

  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const doLaunch = (testD: any) => {
    axios
      .post<IFlowStep[]>(
        `${flowImplementationServerUrl}/execute-one-shot/${flow.id}`,
        {
          initialData: testD,
        }
      )
      .then((res) => {
        setSteps(res.data);
      });
  };

  return (
    <Box sx={{ height: '100%', overflowY: 'scroll', paddingBottom: '30px' }}>
      {steps === null ? (
        <TestCasePanel flow={flow} doLaunch={doLaunch} />
      ) : (
        <>
          <Box
            sx={{
              padding: '5px 5px 0px 5px',
              textAlign: 'center',
              paddingTop: '30px',
            }}
          >
            <Button
              size="small"
              onClick={() => setSteps(null)}
              variant="contained"
            >
              Clear Results
            </Button>
          </Box>
          <Box
            sx={{
              maxWidth: '700px',
              margin: '0px auto 20px auto',
              padding: '0px 0 15px 0',
            }}
          >
            <NonInteractiveStepRenderer steps={steps} />
          </Box>
        </>
      )}
    </Box>
  );
}
