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

export function FillingOutTheFormManually() {
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
        <h2>Filling Out the Form Manually</h2>

        <p>
          In the most basic scenario, an insurance company may not be able to
          automatically resolve any of the questions in the prior authorization
          specification.
        </p>

        <p>
          This could be due to not having any claims or EHR data for the patient
          in question because the patient is a new member, or because the system
          does not have up to date data integrations with external systems using
          an interoperable data standard such as FHIR. Therefore in this case each question required
          must be answered by the provider manually.
        </p>

        <p>
          Below we automatically fill the form for you in this demo, but in a
          real world scenario the healthcare provider would need to fill out the form. 
          Some questions may even require supporting documentation to
          be uploaded such as lab test results or a letter of medical necessity.
        </p>
      </Paper>

      <Paper sx={{ padding: '1px 15px 15px 15px', marginTop: '30px' }}>
        <h2>Manual Form</h2>

        <InteractiveFlowRenderer
          steps={steps}
          onUpdateAnswer={onUpdateAnswer}
        />
      </Paper>
    </Box>
  );
}
