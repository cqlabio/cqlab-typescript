import {
  CQFlowExecutorStateEnum,
  IEmitDataStep,
  InteractiveFlowState,
} from '@cqlab/cqflow-core';
import {
  exampleFlowRepository,
  ExampleFlowDefinitionIdEnum,
} from '../../../index';
import { PatientIdInitialData } from '../../../common/types';
import { MockPatientIdEnum } from '../../../../mock-patients/index';
import { hypertensionDef } from './hypertension-definition';

function getEmptyInteracetiveState(
  patientId: string
): InteractiveFlowState<PatientIdInitialData> {
  return {
    id: '1234',
    status: CQFlowExecutorStateEnum.Initiated,
    answers: [],
    actionsTaken: {},
    initialData: { patientId },
  };
}

describe('Hypertension Flow', () => {
  it('should work for Hypertensive crisis', async () => {
    const flowModule = exampleFlowRepository.getInteractiveModule(
      ExampleFlowDefinitionIdEnum.docs_hypertension
    );

    if (!flowModule) {
      throw new Error('Expecting a module');
    }

    const interactiveFlowState = getEmptyInteracetiveState(
      MockPatientIdEnum.hypertension_crisis
    );

    const onUpdateInteractiveState = async (
      state: InteractiveFlowState<PatientIdInitialData>
    ) => state;

    const steps = await flowModule.execute({
      flowDefinition: hypertensionDef,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    expect(steps.length).toBe(6);

    const emitStep = steps[4] as IEmitDataStep;

    expect(emitStep.label?.includes('Hypertensive crisis')).toBe(true);
  });

  it('should work for normal blood pressure', async () => {
    const flowModule = exampleFlowRepository.getInteractiveModule(
      ExampleFlowDefinitionIdEnum.docs_hypertension
    );

    if (!flowModule) {
      throw new Error('Expecting a module');
    }

    const interactiveFlowState = getEmptyInteracetiveState(
      MockPatientIdEnum.hypertension_none
    );

    const onUpdateInteractiveState = async (
      state: InteractiveFlowState<PatientIdInitialData>
    ) => state;

    const steps = await flowModule.execute({
      flowDefinition: hypertensionDef,
      interactiveFlowState: interactiveFlowState,
      onUpdateInteractiveState: onUpdateInteractiveState,
    });

    expect(steps.length).toBe(12);

    const emitStep = steps[10] as IEmitDataStep;

    expect(emitStep.label?.includes('Blood Pressure is Normal')).toBe(true);
  });
});
