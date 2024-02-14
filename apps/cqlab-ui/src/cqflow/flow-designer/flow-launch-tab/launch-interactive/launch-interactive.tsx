import { useEffect, useState, useCallback } from 'react';
import last from 'lodash/last';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { TestCasePanel } from './test-case-panel';
import { IFlowDefinition } from '@cqlab/cqflow-core';
import { LaunchQuestionnaire } from './launch-questionnaire';
import { useFlowStore } from '../../../flow-store';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useFlowInstances,
  useCreateFlowInstanceMutation,
  useDeleteFlowInstanceMutation,
} from '../../../../data/queries-flow-implementation';

// interface OneshotExecutorState {
//   type: 'oneshot'
//   steps: IFlowStep[]
// }

// type ExecutorState = OneshotExecutorState | QuestionnaireExecutorState

type LaunchInteractiveProps = {
  flow: IFlowDefinition;
};

export function LaunchInteractive({ flow }: LaunchInteractiveProps) {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const [selectedWorkflowInstanceId, setSelectedWorkflowInstanceId] = useState<
    string | null
  >(null);

  const { data: workflowInstances = [] } = useFlowInstances(
    flow.bindId || null,
    flowImplementationServerUrl
  );

  const { mutateAsync: createFlowInstance } = useCreateFlowInstanceMutation(
    flow.bindId || null,
    flowImplementationServerUrl
  );

  const { mutate: deleteFlowInstance } = useDeleteFlowInstanceMutation(
    flowImplementationServerUrl
  );

  const doLaunch = (testD: any) => {
    createFlowInstance(testD).then((res) => {
      setSelectedWorkflowInstanceId(res.data.id);
    });
  };

  const onDeleteInstance = (instanceId: string) => {
    deleteFlowInstance(instanceId);
  };

  if (selectedWorkflowInstanceId) {
    return (
      <LaunchQuestionnaire
        workflowInstanceId={selectedWorkflowInstanceId}
        flowDefinition={flow}
        clearSelectedInstance={() => setSelectedWorkflowInstanceId(null)}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 5 }}>
        <TestCasePanel flow={flow} doLaunch={doLaunch} />
      </Box>

      <Box sx={{ flexGrow: 5 }}>
        <Paper square sx={{ margin: '20px' }}>
          <Box
            sx={{ borderBottom: '1px solid rgb(230,230,230)', padding: '10px' }}
          >
            Workflow Instances
          </Box>
          {workflowInstances.map((instance) => (
            <Box
              key={instance.id}
              sx={{
                fontSize: '13px',
                padding: '7px',

                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                onClick={() => setSelectedWorkflowInstanceId(instance.id)}
                sx={{ flexGrow: 1, cursor: 'pointer' }}
              >
                {last(instance.id.split('-'))}
              </Box>

              <Box>{instance.status}</Box>
              <DeleteIcon
                onClick={() => onDeleteInstance(instance.id)}
                sx={{
                  color: 'rgb(150,150,150)',
                  fontSize: '14px',
                  marginLeft: '5px',
                  cursor: 'pointer',
                  ':hover': {
                    color: 'rgb(100,100,100)',
                  },
                }}
              />
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}
