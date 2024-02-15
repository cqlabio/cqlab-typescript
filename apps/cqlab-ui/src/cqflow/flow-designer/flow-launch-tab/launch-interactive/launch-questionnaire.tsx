import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import {
  IFlowStep,
  IFlowStepAnswer,
  IFlowDefinition,
  CQFlowExecutorStateEnum,
  IStartStep,
} from '@cqlab/cqflow-core';
// import { InteractiveFlowRenderer } from '@cqlab/ui-flow-renderer';
import axios from 'axios';
import { useFlowStore } from '../../../flow-store';
import { InteractiveLayout } from '../common/interactive-layout';
import {
  useFlowInstances,
  useAddFlowInstanceAnswerMutation,
} from '../../../../data/queries-flow-implementation';
import { axiosInstance } from '../../../../data/axios-instance';

type LaunchQuestionnaireProps = {
  // executor: CQFlowExecutorStateful;
  workflowInstanceId: string;
  flowDefinition: IFlowDefinition;
  clearSelectedInstance: () => void;
  // activeSteps: IFlowStep[];
  // onAddAnswer: (stepId: string, answer: IFlowStepAnswer) => void;
};

type InstanceRes = {
  status: CQFlowExecutorStateEnum;
  steps: IFlowStep[];
};

export function LaunchQuestionnaire({
  workflowInstanceId,
  flowDefinition,
  clearSelectedInstance,
}: // activeSteps,

LaunchQuestionnaireProps) {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const [activeSteps, setActiveSteps] = useState<InstanceRes | null>(null);

  // TODO: should be fetching a single instance instead of all
  const { data: workflowInstances = [] } = useFlowInstances(
    flowDefinition.id,
    flowImplementationServerUrl
  );

  const { mutateAsync: addFlowInstanceAnswer } =
    useAddFlowInstanceAnswerMutation(
      workflowInstanceId,
      flowImplementationServerUrl
    );

  const fetchActiveSteps = useCallback(() => {
    axiosInstance
      .get<InstanceRes>(`/flow-instances/${workflowInstanceId}/active-steps`)
      .then((res) => {
        setActiveSteps(res.data);
      });
  }, [workflowInstanceId, flowImplementationServerUrl]);

  useEffect(() => {
    fetchActiveSteps();
  }, [fetchActiveSteps]);

  const onUpdateAnswer = (stepId: string, answer: IFlowStepAnswer) => {
    if (activeSteps?.status === CQFlowExecutorStateEnum.Completed) {
      alert('This flow has already been submitted.');
      return;
    }

    addFlowInstanceAnswer({
      stepId,
      answer,
    }).then(fetchActiveSteps);
  };

  const firstStep = activeSteps?.steps.find(
    (s) => s.stepType === 'Start'
  ) as IStartStep;

  const selectedInstance = workflowInstances.find(
    (instance) => instance.id === workflowInstanceId
  );

  const navHeader = (
    <Box
      sx={{
        display: 'flex',
        padding: '0 0px 0px 0',
        alignItems: 'center',
      }}
    >
      <Box
        onClick={clearSelectedInstance}
        sx={{ color: 'secondary.main', fontSize: '14px', cursor: 'pointer' }}
      >
        All Instances
      </Box>
      <Box sx={{ padding: '0 5px' }}>{'/'}</Box>
      <Box sx={{ fontSize: '11px' }}>{workflowInstanceId}</Box>
    </Box>
  );

  return (
    <InteractiveLayout
      steps={activeSteps?.steps || []}
      onUpdateAnswer={onUpdateAnswer}
      flowState={selectedInstance || null}
      navHeader={navHeader}
    />
  );

  // return (
  //   <Box sx={{ paddingBottom: '100px', width: '1000px', margin: '0 auto' }}>
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         padding: '20px 20px 0px 20px',
  //         alignItems: 'center',
  //       }}
  //     >
  //       <Box
  //         onClick={clearSelectedInstance}
  //         sx={{ color: 'secondary.main', fontSize: '14px', cursor: 'pointer' }}
  //       >
  //         All Instances
  //       </Box>
  //       <Box sx={{ padding: '0 5px' }}>{'/'}</Box>
  //       <Box sx={{ fontSize: '11px' }}>{workflowInstanceId}</Box>
  //     </Box>
  //     {firstStep && (
  //       <Paper
  //         sx={{ margin: '15px 24px 0 24px', background: 'rgb(240,240,240)' }}
  //       >
  //         <Box
  //           sx={{
  //             padding: '10px',
  //             borderBottom: '1px solid rgb(215,215,215)',
  //             textTransform: 'uppercase',
  //             fontSize: '13px',
  //             color: 'rgb(110,110,110)',
  //           }}
  //         >
  //           Launch Data
  //         </Box>
  //         <pre style={{ padding: '10px', margin: 0, fontSize: '14px' }}>
  //           {JSON.stringify(firstStep.initialData, null, 2)}
  //         </pre>
  //       </Paper>
  //     )}

  //     {activeSteps && (
  //       <InteractiveFlowRenderer
  //         steps={activeSteps.steps}
  //         onUpdateAnswer={onAddAnswer}
  //       />
  //     )}
  //   </Box>
  // );
}
