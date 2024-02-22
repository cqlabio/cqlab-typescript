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
import { FlowInstancePanel } from './flow-instance-panel';

// interface OneshotExecutorState {
//   type: 'oneshot'
//   steps: IFlowStep[]
// }

// type ExecutorState = OneshotExecutorState | QuestionnaireExecutorState

type LaunchInteractiveProps = {
  flow: IFlowDefinition;
};

export function LaunchInteractive({ flow }: LaunchInteractiveProps) {
  const [activeTab, setActiveTab] = useState(0);

  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const [selectedWorkflowInstanceId, setSelectedWorkflowInstanceId] = useState<
    string | null
  >(null);

  const { data: workflowInstances = [] } = useFlowInstances(
    flow.id,
    flowImplementationServerUrl
  );

  const { mutateAsync: createFlowInstance } = useCreateFlowInstanceMutation(
    flow.id,
    flowImplementationServerUrl
  );

  const doLaunch = (testD: any) => {
    createFlowInstance(testD).then((res) => {
      setSelectedWorkflowInstanceId(res.data.id);
    });
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

  const tabs = [
    {
      name: 'Launch New',
    },
    {
      name: 'Launch Existing',
    },
  ];

  return (
    <Box>
      <Paper sx={{ maxWidth: '1200px', margin: '30px auto 0 auto' }}>
        <Box
          sx={{ display: 'flex', borderBottom: '1px solid rgb(230,230,230)' }}
        >
          {tabs.map((tab, index) => (
            <Box
              key={index}
              sx={{
                padding: '15px',
                // borderBottom: '1px solid rgb(230,230,230)',
                // fontWeight: 'bold',
                cursor: 'pointer',
                color:
                  index === activeTab ? 'secondary.main' : 'rgb(130,130,130)',
              }}
              onClick={() => setActiveTab(index)}
            >
              {tab.name}
            </Box>
          ))}
        </Box>

        {activeTab === 0 && <TestCasePanel flow={flow} doLaunch={doLaunch} />}

        {activeTab === 1 && (
          <FlowInstancePanel
            flow={flow}
            setSelectedWorkflowInstanceId={setSelectedWorkflowInstanceId}
          />
        )}
      </Paper>

      <Box sx={{ flexGrow: 5 }}></Box>

      <Box sx={{ flexGrow: 5 }}>
        {/* <FlowInstancePanel flow={flow} setSelectedWorkflowInstanceId={setSelectedWorkflowInstanceId} /> */}
        {/* <Paper square sx={{ margin: '20px' }}>
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
              <Box>
                Answers = {instance.answers.length}
              </Box>
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
        </Paper> */}
      </Box>
    </Box>
  );
}
