import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  CQFlowExecutorStateEnum,
  IFlowStep,
  IFlowStepAnswer,
  InteractiveFlowState,
} from '@cqlab/cqflow-core';
import { InteractiveFlowRenderer } from '@cqlab/ui-flow-renderer';
import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';
import { InteractiveBreastCancerScreening as flowDefinition } from '../prior-auth-flow-def';
import { exampleFlowRepository } from '@cqlab/cqexamples';

const patientId = 'needs_breast_cancer_screening';

export function FillingOutTheFormAutoMatically() {
  const [flowInstanceData, setFlowInstanceData] =
    useState<InteractiveFlowState<any> | null>(null);

  const [steps, setSteps] = useState<IFlowStep[]>([]);

  const getEmptyFlowInstance = useCallback(() => {
    return {
      id: '1234',
      flowDefinitionId: flowDefinition.id,
      status: CQFlowExecutorStateEnum.Initiated,
      answers: [],
      actionsTaken: {},
      initialData: {
        patientId: patientId,
      },
    } as InteractiveFlowState<{ patientId: string }>;
  }, [flowDefinition.id, patientId]);

  useEffect(() => {
    setFlowInstanceData(getEmptyFlowInstance());
  }, [getEmptyFlowInstance]);

  useEffect(() => {
    if (!flowInstanceData) {
      return;
    }
    executeFlowInstance();
  }, [flowInstanceData]);

  const flowModule = useMemo(() => {
    if (!flowDefinition?.bindId) {
      return null;
    }
    const interactiveModule = exampleFlowRepository.getInteractiveModule(
      flowDefinition.bindId as string
    );

    if (!interactiveModule) {
      console.error(`Could not find module for ${flowDefinition.bindId}`);
    }

    return interactiveModule;
  }, [flowDefinition?.bindId]);

  const onUpdateAnswer = (stepId: string, answer: IFlowStepAnswer) => {
    console.log(answer);
  };

  const executeFlowInstance = async () => {
    if (!flowModule || !flowInstanceData) {
      return;
    }

    const steps = await flowModule.execute({
      flowDefinition: flowDefinition,
      interactiveFlowState: flowInstanceData,
      onUpdateInteractiveState: async (interactiveFlowState) => {
        setFlowInstanceData(interactiveFlowState);
        return interactiveFlowState;
      },
    });

    setSteps(steps);
  };

  return (
    <Box>
      <Paper sx={{ padding: '1px 15px 15px 15px' }}>
        <h2>Filling Out the Form Automatically</h2>

        <p>
          One way to significantly reduce the administrative burden of prior
          authorization is to automatically fill out parts of the form for the
          provider. CQLab provides tooling that allows the prior authorization
          specification to be extended with database queries, algorithms, or AI
          models to resolve questions.
        </p>

        <p>
          Depending on the types of questions and amount of supporting evidence
          required by the insurance company, administrative burden can be
          reduced by 50% or more. Some requests can even be fully approved or
          rejected without requiring a provider to fill out the form at all.
        </p>

        <p>
          Many hospital systems and other frontline providers have entire teams
          dedicated to filling out prior authorization requests. This burden
          reduction can free up these teams to focus on other tasks, while also
          reducing errors that occur during manual data entry.
        </p>
      </Paper>

      <Paper sx={{ padding: '1px 15px 15px 15px', marginTop: '30px' }}>
        <h2>The Form</h2>

        <InteractiveFlowRenderer
          steps={steps}
          onUpdateAnswer={onUpdateAnswer}
        />
      </Paper>
    </Box>
  );
}
