import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { InteractiveLayout } from '../common/interactive-layout';
import { EmptyInteractiveContext } from './empty-flow-implementation';
import {
  IFlowDefinition,
  InteractiveFlowState,
  executeInteractiveFlow,
  CQFlowExecutorStateEnum,
  IFlowStep,
  IFlowStepAnswer,
  InteractiveFlowImplementation,
} from '@cqlab/cqflow-core';

// import { InteractiveFlowRenderer } from '@cqlab/ui-flow-renderer';
import { useFlowStore } from '../../../flow-store';

function createFlowInstance(flowDefId: string, selectedPatientId: string) {
  return {
    id: '1234',
    flowDefinitionId: flowDefId,
    status: CQFlowExecutorStateEnum.Initiated,
    answers: [],
    actionsTaken: {},
    initialData: {
      patientId: selectedPatientId,
    },
  } as InteractiveFlowState<{ patientId: string }>;
}

type LaunchDefaultInteractiveProps = {
  flowDefinition: IFlowDefinition;
};

export function LaunchDefaultInteractive({
  flowDefinition,
}: LaunchDefaultInteractiveProps) {
  const { flowState, updateDefaultFlowState } = useFlowStore((state) => ({
    flowState: state.defaultFlowState[flowDefinition.id],
    updateDefaultFlowState: state.updateDefaultFlowState,
  }));

  const [steps, setSteps] = useState<IFlowStep[]>([]);

  const executeFlow = useCallback(async () => {
    if (!flowState) {
      return;
    }

    const context = new EmptyInteractiveContext({
      flowDefinition: flowDefinition,
      interactiveFlowState: flowState,
      onUpdateInteractiveState: async (newState) => {
        updateDefaultFlowState(flowDefinition.id, newState);
        return newState;
      },
    });

    const emptyInteractiveImplementation =
      new InteractiveFlowImplementation<EmptyInteractiveContext>();

    try {
      const steps = await executeInteractiveFlow(
        emptyInteractiveImplementation,
        context
      );
      setSteps(steps);
    } catch (err) {
      console.error(err);
      alert('There was an error executing the flow' + err);
      reset();
    }
  }, [flowDefinition, flowState, updateDefaultFlowState]);

  const reset = useCallback(() => {
    updateDefaultFlowState(
      flowDefinition.id,
      createFlowInstance(flowDefinition.id, '1234')
    );
  }, [flowDefinition.id, updateDefaultFlowState]);

  useEffect(() => {
    if (!flowState) {
      reset();
    }
  }, [flowState]);

  useEffect(() => {
    executeFlow();
  }, [executeFlow]);

  const onUpdateAnswer = (stepId: string, answer: IFlowStepAnswer) => {
    if (!flowState) {
      return;
    }

    const nextFlowInstance = {
      ...flowState,
      answers: [...flowState.answers],
    };

    nextFlowInstance.answers.push({
      stepId: stepId,
      answer,
    });

    updateDefaultFlowState(flowDefinition.id, nextFlowInstance);
  };

  return (
    <InteractiveLayout
      steps={steps}
      onUpdateAnswer={onUpdateAnswer}
      flowState={flowState}
      onResetState={reset}
      navHeader={
        <Box
          sx={{
            padding: '5px 10px',
            color: 'rgb(100,100,100)',
            background: 'rgb(240,240,240)',
            border: '1px solid rgb(220,220,220)',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          Flow implementation not found. Falling back to{' '}
          <strong>default</strong> implementation.{' '}
        </Box>
      }
    />
    // <Box sx={{maxWidth: '1000px', margin: '0 auto 100px auto'}}>
    //     <Box sx={{
    //       background: '#FFF8E1',
    //       margin:'20px 20px 0 20px',
    //       alignItems: 'center',
    //       borderRadius: '5px',
    //       border: '1px solid #FFECB3',
    //       padding: '7px', display: 'flex', justifyContent: 'space-between'}}>
    //       <Box>

    //       Flow Implementation not found. Using default interactive implementation.
    //       </Box>
    //       <Box>

    //       <Button
    //       disabled={flowState?.answers.length === 0}
    //       onClick={reset} variant='contained' size='small'>
    //         Reset
    //       </Button>
    //       </Box>
    //     </Box>

    //     <InteractiveFlowRenderer
    //       steps={steps}
    //       onUpdateAnswer={onUpdateAnswer}
    //     />
    // </Box>
  );
}
